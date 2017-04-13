# frozen_string_literal: true

module SessionHelpers
  def login
    stub_request(:get, token_url).and_return(status: 200)
    visit root_path(token: 123)
    expect(a_request(:get, token_url)).to have_been_made.once
    WebMock.reset!
  end

  def in_browser(name)
    old_session = Capybara.session_name
    Capybara.session_name = name
    yield
    Capybara.session_name = old_session
  end

  def token_url
    "#{Rails.configuration.intake[:authentication_base_url]}/authn/validate?token=123"
  end
end

RSpec.configure do |config|
  config.include SessionHelpers, type: :feature
end
