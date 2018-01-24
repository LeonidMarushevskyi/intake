# frozen_string_literal: true

require 'timeout'
require 'support/helpers/keyboard_helper'

module AutocompleterHelpers
  def within_person_search_result(name:)
    within '#search-card', text: 'Search' do
      within(:xpath, "//*[text()[contains(., '#{name}')]]/../../../..") do
        yield
      end
    end
  end
end

RSpec.configure do |config|
  config.include AutocompleterHelpers, type: :feature
end
