# frozen_string_literal: true

module ShameHelpers
  def fill_in_datepicker(locator, with:)
    dateString = if with.class == Date
                   with.strftime('%m/%d/%Y')
                 elsif with.class == Time
                   with.strftime('%m/%d/%Y %l:%M %p')
                 elsif with.class == DateTime
                   with.strftime('%m/%d/%Y%l:M %p')
                 else
                   with
                 end
    # change events for the datepicker are only firing correctly after the
    # second event because of differences in how capybara is triggering
    # change events
    # also, the blur event is important to the component lifecycle so we
    # need to trigger that by clicking on an arbitrary element.
    fill_in(locator, with: dateString)
    fill_in(locator, with: dateString)
    first('*').click
  end
end

RSpec.configure do |config|
  config.include ShameHelpers, type: :feature
end
