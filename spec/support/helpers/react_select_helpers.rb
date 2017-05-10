# frozen_string_literal: true

module ReactSelectHelpers
  def fill_in_react_select(selector, with:)
    input = find_field(selector)
    input.send_keys with
    input.native.send_keys :return
  end

  def has_react_select_field(selector, with:)
    input = find_field(selector)
    input_container = input.parent
    selected_values = input_container.all('.Select-value-label').map(&:text)
    expect(selected_values).to eq(with)
  end

  def remove_react_select_option(selector, option)
    input = find_field(selector)
    close_icon = input.find(:xpath, <<-XPATH)
      ./../../div[@class='Select-value']
      /span[contains(.,'#{option}')]/../span[@class='Select-value-icon']
    XPATH
    close_icon.click
  end
end

RSpec.configure do |config|
  config.include ReactSelectHelpers, type: :feature
end
