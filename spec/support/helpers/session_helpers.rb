# frozen_string_literal: true

module SessionHelpers
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
