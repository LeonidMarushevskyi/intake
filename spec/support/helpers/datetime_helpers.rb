# frozen_string_literal: true

module DateTimeHelpers
  def mouse_select_datepicker(locator, day)
    component = page.find(locator)
    component.find('.rw-btn-calendar').click
    component.find(
      "[id*='calendar__month'][id$='#{day}']", visible: :all
    ).click
  end

  def mouse_select_timepicker(locator, time)
    component = page.find(locator)
    component.find('.rw-btn-time').native.click
    component.find('.rw-list-option', text: time).click
  end
end

RSpec.configure do |config|
  config.include DateTimeHelpers, type: :feature
end
