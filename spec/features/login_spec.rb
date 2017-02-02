# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'

feature 'login' do
  before do
    allow(ENV).to receive(:fetch).with('AUTHENTICATION_URL')
      .and_return('http://www.foo.com')
  end

  scenario 'user does not have a session' do
    Feature.run_with_activated(:release_one) do
      visit root_path
      expect(page.current_url).to have_content 'http://www.foo.com/authn/login'
    end
  end

  scenario 'user provides valid security token' do
    Feature.run_with_activated(:release_one) do
      stub_request(:get, 'http://www.foo.com/authn/validate?token=123').and_return(status: 200)
      visit root_path(token: 123)
      expect(a_request(:get, 'http://www.foo.com/authn/validate?token=123')).to have_been_made
      expect(page.current_url).to_not have_content 'http://www.foo.com'
      expect(page).to have_current_path(root_path(token: 123))
    end
  end

  scenario 'user provides invalid security token' do
    Feature.run_with_activated(:release_one) do
      stub_request(:get, 'http://www.foo.com/authn/validate?token=123').and_return(status: 401)
      visit root_path(token: 123)
      expect(a_request(:get, 'http://www.foo.com/authn/validate?token=123')).to have_been_made
      expect(page.current_url).to have_content 'http://www.foo.com/authn/login'
    end
  end
end

