# frozen_string_literal: true

module ScreeningHelpers
  def edit_participant_card_selector(participant_id)
    "#participants-card-#{participant_id}.edit"
  end

  def show_participant_card_selector(participant_id)
    "#participants-card-#{participant_id}.show"
  end
end

RSpec.configure do |config|
  config.include ScreeningHelpers, type: :feature
end
