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

  def validate_message_as_user_interacts_with_card(
    card_name:, error_message:, invalid_screening:, screening_updates:
  )
    should_not_have_content error_message, inside: "##{card_name}-card.edit"
    stub_screening_put_request_with_anything_and_return invalid_screening
    save_card(card_name)

    should_have_content error_message, inside: "##{card_name}-card.show"
    edit_card(card_name)

    should_have_content error_message, inside: "##{card_name}-card.edit"

    yield # make field valid to clear errors

    should_not_have_content error_message, inside: "##{card_name}-card.edit"

    stub_screening_put_request_with_anything_and_return(
      screening,
      with_updated_attributes: screening_updates
    )
    save_card(card_name)
    should_not_have_content error_message, inside: "##{card_name}-card.show"
  end

  def stub_empty_relationships_for_screening(screening)
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_relationships_by_screening_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
  end

  def stub_empty_history_for_screening(screening)
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
  end

  def validate_message_as_user_interacts_with_date_field(
    card_name:, error_message:, field:, invalid_value:, valid_value:
  )
    within "##{card_name}-card.edit" do
      expect(page).not_to have_content(error_message)
      fill_in_datepicker field, with: invalid_value, blur: false
      expect(page).not_to have_content(error_message)
      blur_field
      expect(page).to have_content(error_message)
      fill_in_datepicker field, with: valid_value, blur: true
      expect(page).not_to have_content(error_message)
    end
  end

  def stub_and_visit_edit_screening(screening)
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.evaluate_script('window.location.reload()')
  end

  def stub_and_visit_show_screening(screening)
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    visit screening_path(id: screening.id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.evaluate_script('window.location.reload()')
  end
end

RSpec.configure do |config|
  config.include ScreeningHelpers, type: :feature
end
