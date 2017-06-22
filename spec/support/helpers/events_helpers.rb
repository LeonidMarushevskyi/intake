# frozen_string_literal: true

module EventsHelpers
  def simulate(event, on:)
    execute_script("$('#{on}').trigger('#{event}')")
  end

  def focused_element
    evaluate_script('document.activeElement')
  end
end

RSpec.configure do |config|
  config.include EventsHelpers
end
