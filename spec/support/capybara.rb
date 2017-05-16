# frozen_string_literal: true

require 'capybara/rspec'
require 'capybara/accessible'
require 'support/capybara/screenshot'

Capybara.default_driver = :accessible_selenium
Capybara.javascript_driver = Capybara.default_driver

# Allow aria-label to be used in locators
Capybara.enable_aria_label = true

if ENV['TEST_ENV_NUMBER'].is_a?(Integer)
  Capybara.server_port = 8888 + ENV['TEST_ENV_NUMBER'].to_i
end
