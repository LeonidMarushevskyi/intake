# frozen_string_literal: true

module AlertHelper
  def alert_dialog
    page.driver.browser.switch_to.alert
  end
end

RSpec.configure do |config|
  config.include AlertHelper, type: :feature
end
