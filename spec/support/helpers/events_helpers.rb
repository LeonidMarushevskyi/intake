# frozen_string_literal: true

module EventsHelpers
  def js_simulate(event, on:)
    execute_script("$('#{on}').trigger('#{event}')")
  end

  def focused_native_element
    evaluate_script('document.activeElement')
  end
end

RSpec.configure do |config|
  config.include EventsHelpers
end
