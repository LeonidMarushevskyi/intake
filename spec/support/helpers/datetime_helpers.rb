# frozen_string_literal: true

module DateTimeHelpers
  def mouse_select_datepicker(locator, date)
    zero_indexed_month = date.month - 1
    component = page.find(locator)
    component.find('.rw-btn-calendar').click
    component.find(
      "[id$='cal_calendar__month_#{zero_indexed_month}-#{date.day}']", visible: :all
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
