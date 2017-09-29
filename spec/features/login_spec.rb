# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'login' do
  let(:auth_login_url) { 'http://www.example.com/authn/login?callback=' }
  let(:auth_validation_url) { 'http://www.example.com/authn/validate?token=123' }
  let(:auth_artifact) do
    { staffId: '1234' }
  end
  let(:staff_info) do
    { first_name: 'Joe', last_name: 'Cool' }
  end
  let(:screening_results) { [{ id: '1' }, { id: '2' }] }

  around do |example|
    with_config(
      authentication_base_url: 'http://www.example.com',
      authentication_login_url: auth_login_url,
      base_path: ''
    ) do
      example.run
    end
  end

  scenario 'user has not logged in', browser: :poltergeist do
    Feature.run_with_activated(:authentication) do
      visit root_path
      expect(page.current_url).to have_content(auth_login_url)
    end
  end

  context 'user provides valid security token', browser: :poltergeist do
    let(:staff_url) { intake_api_url(ExternalRoutes.intake_api_staff_path(1234)) }
    before do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screening_results, status: 200))
    end

    scenario 'and verification provides staff_id' do
      Feature.run_with_activated(:authentication) do
        stub_request(:get, auth_validation_url)
          .and_return(json_body(auth_artifact.to_json, status: 200))
        stub_request(:get, staff_url)
          .and_return(json_body(staff_info.to_json, status: 200))
        visit root_path(token: 123)
        expect(a_request(:get, auth_validation_url)).to have_been_made
        expect(a_request(:get, staff_url)).to have_been_made
        expect(page.current_url).to_not have_content auth_login_url
        expect(page).to have_current_path(root_path(token: 123))
      end
    end

    scenario 'and verification does not provide staff_id' do
      Feature.run_with_activated(:authentication) do
        stub_request(:get, auth_validation_url)
          .and_return(status: 200)
        visit root_path(token: 123)
        expect(a_request(:get, auth_validation_url)).to have_been_made
        expect(a_request(:get, staff_url)).to_not have_been_made
        expect(page.current_url).to_not have_content auth_login_url
        expect(page).to have_current_path(root_path(token: 123))
      end
    end
  end

  scenario 'user provides invalid security token', browser: :poltergeist do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, auth_validation_url).and_return(status: 401)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      expect(page.current_url).to have_content auth_login_url
    end
  end

  scenario 'user has already logged in', browser: :poltergeist do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screening_results, status: 200))
      stub_request(:get, auth_validation_url).and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, auth_validation_url)).to have_been_made
      WebMock.reset!

      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(screening_results, status: 200))
      visit root_path
      expect(a_request(:get, %r{http://www.example.com})).to_not have_been_made
      expect(page).to have_current_path(root_path)
    end
  end

  scenario 'user uses session token when communicating to API' do
    Feature.run_with_activated(:authentication) do
      screening = FactoryGirl.create(:screening, name: 'My Screening')
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(1)))
        .and_return(json_body(screening.to_json, status: 200))
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body([].to_json, status: 200))
      stub_request(:get, auth_validation_url)
        .and_return(json_body(auth_artifact.to_json, status: 200))

      bobs_token = 'BOBS_TOKEN'
      Capybara.using_session(:bob) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{bobs_token}")
          .and_return(status: 200)
        visit root_path(token: bobs_token)
      end

      alexs_token = 'ALEXS_TOKEN'
      Capybara.using_session(:alex) do
        stub_request(:get, "http://www.example.com/authn/validate?token=#{alexs_token}")
          .and_return(status: 200)
        visit root_path(token: alexs_token)
      end

      Capybara.using_session(:bob) do
        visit screening_path(1)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(1)))
          .with(headers: { 'Authorization' => bobs_token })
        ).to have_been_made
      end

      Capybara.using_session(:alex) do
        visit screening_path(1)
        expect(page).to have_content 'My Screening'
        expect(
          a_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(1)))
          .with(headers: { 'Authorization' => alexs_token })
        ).to have_been_made
      end
    end
  end
end
