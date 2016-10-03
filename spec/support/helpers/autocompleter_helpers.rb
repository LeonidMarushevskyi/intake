# frozen_string_literal: true

require 'timeout'
require 'support/helpers/keyboard_helper'

module AutocompleterHelpers
  include KeyboardHelper
  RESULTS_CONTAINER = '.react-autosuggest__suggestions-container ul'

  def fill_in_autocompleter(locator, options)
    value = options[:with]
    populate_autocompleter_with_options(locator, value)
    click_autocompleter_result(value)
  end

  def populate_autocompleter_with_options(locator, value)
    unless Capybara.current_driver.to_s =~ /selenium|accessible/
      raise 'You need to tag your test with @javascript to use this step'
    end

    fill_in(locator, with: value)

    # Firefox doesn't trigger focus/blur when the window doesn't have system focus
    # So, we added a click handler to the autocompleter as an alternative way to
    # trigger the dropdown.
    field = find_field(locator)
    field.click unless field.base.click
  end

  def click_autocompleter_result(value)
    wait_for_result_to_appear(value)
    press_key :down
  rescue Timeout::Error
    raise "Unable to find autocompleter result with text:\n#{value}"
  rescue Selenium::WebDriver::Error::StaleElementReferenceError
    sleep(0.1)
    retry
  end

  def whole_page
    page.find(:xpath, '//body')
  end

  def wait_for_result_to_appear(value)
    Timeout.timeout(2.0 * Capybara.default_wait_time) do
      sleep(0.1) until page.first(
        RESULTS_CONTAINER.to_s,
        visible: true,
        text: value,
        exact: false
      )
    end
  end
end

RSpec.configure do |config|
  config.include AutocompleterHelpers, type: :feature
end
