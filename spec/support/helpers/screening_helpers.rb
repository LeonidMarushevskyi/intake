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

  def stub_empty_relationships_for_screening(screening)
    stub_request(
      :get,
      intake_api_url(ExternalRoutes.intake_api_relationships_by_screening_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
  end

  def stub_empty_history_for_screening(screening)
    stub_request(
      :get,
      intake_api_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
  end

  def stub_and_visit_edit_screening(screening)
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.driver.browser.navigate.refresh
  end

  def stub_and_visit_show_screening(screening)
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.driver.browser.navigate.refresh
  end

  def save_all_cards
    within('.card', text: 'Screening Information') { click_button 'Save' }
    within('.card', text: 'Narrative') { click_button 'Save' }
    within('.card', text: 'Incident Information') { click_button 'Save' }
    within('.card', text: 'Allegations') { click_button 'Save' }
    within('.card', text: 'Worker Safety') { click_button 'Save' }
    within('.card', text: 'Cross Report') { click_button 'Save' }
    within('.card', text: 'Decision') { click_button 'Save' }
  end

  def cancel_all_cards
    within('.card', text: 'Screening Information') { click_button 'Cancel' }
    within('.card', text: 'Narrative') { click_button 'Cancel' }
    within('.card', text: 'Incident Information') { click_button 'Cancel' }
    within('.card', text: 'Allegations') { click_button 'Cancel' }
    within('.card', text: 'Worker Safety') { click_button 'Cancel' }
    within('.card', text: 'Cross Report') { click_button 'Cancel' }
    within('.card', text: 'Decision') { click_button 'Cancel' }
  end
end

RSpec.configure do |config|
  config.include ScreeningHelpers, type: :feature
end
