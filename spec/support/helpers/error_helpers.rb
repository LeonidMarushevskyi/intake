# frozen_string_literal: true

module ErrorHelpers
  def edit_view_should_have_error(card, error_message)
    within "##{card}-card.edit" do
      expect(page).to have_content(error_message)
    end
  end

  def edit_view_should_not_have_error(card, error_message)
    within "##{card}-card.edit" do
      expect(page).not_to have_content(error_message)
    end
  end

  def show_view_should_have_error(card, error_message)
    within "##{card}-card.show" do
      expect(page).to have_content(error_message)
    end
  end

  def show_view_should_not_have_error(card, message)
    within "##{card}-card.show" do
      expect(page).not_to have_content(message)
    end
  end
end

RSpec.configure do |config|
  config.include ErrorHelpers, type: :feature
end
