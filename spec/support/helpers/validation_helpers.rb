# frozen_string_literal: true

module ValidationHelpers
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

  def validate_message_as_user_interacts_with_person_card(
    person_name:, error_message:, invalid_person:, person_updates:
  )
    within('.card.edit', text: person_name) { expect(page).not_to have_content(error_message) }

    stub_request(
      :put,
      intake_api_url(ExternalRoutes.intake_api_participant_path(invalid_person.id))
    ).and_return(json_body(invalid_person.to_json))

    within('.card.edit', text: person_name) { click_button 'Save' }

    within('.card.show', text: person_name) do
      expect(page).to have_content(error_message)
      click_link 'Edit'
    end

    within '.card.edit', text: person_name { expect(page).to have_content(error_message) }

    yield # make field valid to clear errors

    invalid_person.update_attributes(person_updates)
    stub_request(
      :put,
      intake_api_url(ExternalRoutes.intake_api_participant_path(invalid_person.id))
    ).and_return(json_body(invalid_person.to_json))

    within '.card.edit', text: person_name do
      expect(page).not_to have_content(error_message)
      click_button 'Save'
    end

    within '.card.show', text: person_name { expect(page).not_to have_content(error_message) }
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
end

RSpec.configure do |config|
  config.include ValidationHelpers, type: :feature
end
