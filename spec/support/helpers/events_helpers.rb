# frozen_string_literal: true

module EventsHelpers
  def focused_native_element
    evaluate_script('document.activeElement')
  end

  def blur_field
    page.first('*').click
  end
end

RSpec.configure do |config|
  config.include EventsHelpers
end
