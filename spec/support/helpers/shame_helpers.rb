# frozen_string_literal: true

module ShameHelpers
  def fill_in_datepicker(locator, with:)
    date_string = date_to_string(with)
    # change events for the datepicker are only firing correctly after the
    # second event because of differences in how capybara is triggering
    # change events
    # also, the blur event is important to the component lifecycle so we
    # need to trigger that by clicking on an arbitrary element.
    fill_in(locator, with: date_string)
    fill_in(locator, with: date_string)
    first('*').click
  end

  def date_to_string(date_object)
    if date_object.class == Date
      date_object.strftime('%m/%d/%Y')
    elsif date_object.class == Time
      date_object.strftime('%m/%d/%Y %l:%M %p')
    elsif date_object.class == DateTime
      date_object.strftime('%m/%d/%Y%l:M %p')
    else
      date_object
    end
  end
end

RSpec.configure do |config|
  config.include ShameHelpers, type: :feature
end
