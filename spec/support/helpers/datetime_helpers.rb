# frozen_string_literal: true

module DateTimeHelpers
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
