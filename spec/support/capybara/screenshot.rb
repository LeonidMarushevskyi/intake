# frozen_string_literal: true

require 'capybara-screenshot'
require 'capybara-screenshot/rspec'

Capybara::Screenshot.register_driver(:accessible_selenium) do |driver, path|
  # This is assuming Capybara::Accessible is currently using Selenium
  # underneath.
  driver.browser.save_screenshot(path)
end

Capybara::Screenshot.register_filename_prefix_formatter(:rspec) do |example|
  example.location.gsub(%r{^./}, '').gsub(%r{[/:]}, '__')
end

Capybara::Screenshot.prune_strategy = { keep: 100 }
Capybara::Screenshot.append_timestamp = false
