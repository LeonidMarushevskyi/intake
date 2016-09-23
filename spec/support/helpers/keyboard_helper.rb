# frozen_string_literal: true

module KeyboardHelper
  def press_key(key)
    current_input = page.driver.browser.switch_to.active_element
    current_input.send_key(key)
  end
end

RSpec.configure do |config|
  config.include KeyboardHelper, type: :feature
end
