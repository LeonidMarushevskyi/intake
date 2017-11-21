# frozen_string_literal: true

module Capybara
  class Session
    def has_react_select_field?(locator, with:)
      input = find_field(locator)
      input_container = input.find(:xpath, '../..')
      selected_values = input_container.all('.Select-value-label').map(&:text)
      return true if selected_values == with
      raise Capybara::ExpectationNotMet, "expected to find react select \"#{locator}\"
      with #{with} selected, but instead found #{selected_values}"
    end
  end
end
