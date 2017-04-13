# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'

feature 'login' do
  around do |example|
    authentication_url = ENV['AUTHENTICATION_URL']
    ENV['AUTHENTICATION_URL'] = 'http://www.foo.com'
    example.run
    ENV['AUTHENTICATION_URL'] = authentication_url
  end

  scenario 'user has not logged in' do
    Feature.run_with_activated(:authentication) do
      visit root_path
      expect(page.current_url).to have_content 'http://www.foo.com/authn/login'
    end
  end

  scenario 'user provides valid security token' do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, 'http://www.foo.com/authn/validate?token=123').and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, 'http://www.foo.com/authn/validate?token=123')).to have_been_made
      expect(page.current_url).to_not have_content 'http://www.foo.com'
      expect(page).to have_current_path(root_path(token: 123))
    end
  end

  scenario 'user provides invalid security token' do
    Feature.run_with_activated(:authentication) do
      stub_request(:get, 'http://www.foo.com/authn/validate?token=123').and_return(status: 401)
      visit root_path(token: 123)
      expect(a_request(:get, 'http://www.foo.com/authn/validate?token=123')).to have_been_made
      expect(page.current_url).to have_content 'http://www.foo.com/authn/login'
    end
  end

  scenario 'user has already logged in' do
    Feature.run_with_activated(:authentication) do
      login
      visit root_path
      expect(a_request(:get, %r{http://www.foo.com})).to_not have_been_made
      expect(page).to have_current_path(root_path)
    end
  end
end
