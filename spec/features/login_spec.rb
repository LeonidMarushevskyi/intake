# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'login' do
  let(:auth_login_url) { 'http://www.example.com/authn/login?callback=' }
  let(:auth_validation_url) { 'http://www.example.com/authn/validate?token=123' }

  around do |example|
    with_config(
      authentication_base_url: 'http://www.example.com',
      authentication_login_url: auth_login_url,
      base_path: '/'
    ) do
      example.run
    end
  end

  scenario 'user has not logged in', accessibility: false do
    Feature.run_with_activated(:authentication) do
      visit root_path
      expect(page.current_url).to have_content(auth_login_url)
    end
  end

  scenario 'user provides valid security token', accessibility: false do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, auth_validation_url).and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(page.current_url).to_not have_content auth_login_url
      expect(page).to have_current_path(root_path)
    end
  end

  scenario 'user provides invalid security token', accessibility: false do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, auth_validation_url).and_return(status: 401)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(page.current_url).to have_content auth_login_url
    end
  end

  scenario 'user has already logged in', accessibility: false do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, auth_validation_url).and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      WebMock.reset!

      visit root_path
      expect(a_request(:get, %r{http://www.example.com})).to_not have_been_made
      expect(page).to have_current_path(root_path)
    end
  end

  scenario 'user uses session token when communicating to API' do
    Feature.run_with_activated(:authentication) do
      screening = FactoryGirl.create(:screening, name: 'My Screening')
      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(1)))
        .and_return(json_body(screening.to_json, status: 200))
      stub_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body([].to_json, status: 200))

      bobs_token = 'BOBS_TOKEN'
      in_browser(:bob) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{bobs_token}")
          .and_return(status: 200)
        visit root_path(token: bobs_token)
      end

      alexs_token = 'ALEXS_TOKEN'
      in_browser(:alex) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{alexs_token}")
          .and_return(status: 200)
        visit root_path(token: alexs_token)
      end

      in_browser(:bob) do
        visit screening_path(1)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, host_url(ExternalRoutes.intake_api_screening_path(1)))
          .with(headers: { 'Authorization' => bobs_token })
        ).to have_been_made
      end

      in_browser(:alex) do
        visit screening_path(1)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, host_url(ExternalRoutes.intake_api_screening_path(1)))
          .with(headers: { 'Authorization' => alexs_token })
        ).to have_been_made
      end
    end
  end
end
