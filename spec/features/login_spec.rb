# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'

feature 'login' do
  let(:authentication_login_url) { Rails.configuration.intake[:authentication_login_url] }
  let(:authentication_base_url) { Rails.configuration.intake[:authentication_base_url] }
  let(:token_url) { "#{authentication_base_url}/authn/validate?token=123" }

  scenario 'user has not logged in', accessibility: false do
    Feature.run_with_activated(:authentication) do
      visit root_path
      expect(page.current_url).to have_content authentication_login_url
    end
  end

  scenario 'user provides valid security token', accessibility: false do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, token_url).and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, token_url)).to have_been_made
      expect(page.current_url).to_not have_content 'http://www.example.com'
      expect(page).to have_current_path(root_path(token: 123))
    end
  end

  scenario 'user provides invalid security token', accessibility: false do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, token_url).and_return(status: 401)
      visit root_path(token: 123)
      expect(a_request(:get, token_url)).to have_been_made
      expect(page.current_url).to have_content authentication_login_url
    end
  end

  scenario 'user has already logged in', accessibility: false do
    Feature.run_with_activated(:authentication) do
      login
      visit root_path
      expect(a_request(:get, %r{http://www.example.com})).to_not have_been_made
      expect(page).to have_current_path(root_path)
    end
  end

  scenario 'user uses session token when communicating to API' do
    Feature.run_with_activated(:authentication) do
      bobs_token = '456'
      in_browser(:bob) do
        stub_request(:get, "http://www.foo.com/authn/validate?token=#{bobs_token}")
          .and_return(status: 200)
        visit root_path(token: bobs_token)
      end

      alexs_token = '678'
      in_browser(:alex) do
        stub_request(:get, "http://www.foo.com/authn/validate?token=#{alexs_token}")
          .and_return(status: 200)
        visit root_path(token: alexs_token)
      end

      WebMock.reset!

      in_browser(:bob) do
        visit screening_path(1)
        expect(
          a_request(:get, api_screening_path(1))
          .with(headers: { 'Authorization' => bobs_token })
        ).to have_been_made
      end

      in_browser(:alex) do
        visit screening_path(1)
        expect(
          a_request(:get, api_screening_path(1))
          .with(headers: { 'Authorization' => alexs_token })
        ).to have_been_made
      end
    end
  end
end
