# frozen_string_literal: true

module DateTimeHelpers
  def mouse_select_datepicker(locator, date)
    zero_indexed_month = date.month - 1
    within locator do
      find('.rw-btn-calendar').click
      find("[id$='cal_calendar__month_#{zero_indexed_month}-#{date.day}']", visible: true).click
    end
  end

  def select_time_from_timepicker(locator, time)
    within locator do
      find('.rw-btn-time').native.click
      find('.rw-list-option', text: /\A#{time.strip}\z/).click
    end
  end

  def select_today_from_calendar(locator)
    within locator do
      find('.rw-btn-calendar').native.click
      find('button', text: Time.now.strftime('%B %-d, %Y')).native.click
    end
  end
end

RSpec.configure do |config|
  config.include DateTimeHelpers, type: :feature
end
