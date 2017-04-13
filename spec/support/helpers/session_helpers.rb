# frozen_string_literal: true

module SessionHelpers
  def login
    stub_request(:get, 'http://www.foo.com/authn/validate?token=123').and_return(status: 200)
    visit root_path(token: 123)
    expect(a_request(:get, 'http://www.foo.com/authn/validate?token=123')).to have_been_made.once
    expect(page).to have_current_path(root_path(token: 123))
    WebMock.reset!
  end

  def in_browser(name)
    old_session = Capybara.session_name
    Capybara.session_name = name
    yield
    Capybara.session_name = old_session
  end
end

RSpec.configure do |config|
  config.include SessionHelpers, type: :feature
end
