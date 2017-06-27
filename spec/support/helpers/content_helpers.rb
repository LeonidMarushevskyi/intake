# frozen_string_literal: true

module ContentHelpers
  def should_have_content(string, inside:)
    within inside do
      expect(page).to have_content(string)
    end
  end

  def should_not_have_content(string, inside:)
    within inside do
      expect(page).not_to have_content(string)
    end
  end
end

RSpec.configure do |config|
  config.include ContentHelpers, type: :feature
end
