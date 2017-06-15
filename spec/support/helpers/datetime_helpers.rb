# frozen_string_literal: true

module DateTimeHelpers
  def mouse_select_datepicker(locator, day)
    component = page.find(locator)
    component.find('.rw-btn-calendar').click
    component.find(
      "[id^='cross_report_reported_on_cal_calendar__month'][id$='#{day}']", visible: false
    ).click
  end
end

RSpec.configure do |config|
  config.include DateTimeHelpers, type: :feature
end
