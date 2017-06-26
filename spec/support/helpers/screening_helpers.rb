# frozen_string_literal: true

module ScreeningHelpers
  def edit_participant_card_selector(participant_id)
    "#participants-card-#{participant_id}.edit"
  end

  def show_participant_card_selector(participant_id)
    "#participants-card-#{participant_id}.show"
  end

  def save_card(card_name)
    within "##{card_name}-card.edit" do
      click_button 'Save'
    end
  end

  def edit_card(card_name)
    within "##{card_name}-card.show" do
      click_link 'Edit'
    end
  end
end

RSpec.configure do |config|
  config.include ScreeningHelpers, type: :feature
end
