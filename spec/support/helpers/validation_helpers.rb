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
    error_message: nil, person:, person_updates:, error_messages: nil
  )
    error_messages ||= [error_message]
    within edit_participant_card_selector(person.id) do
      error_messages.each do |message|
        expect(page).not_to have_content(message)
      end
    end

    stub_request(
      :put,
      intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
    ).and_return(json_body(person.to_json))

    within('.card.edit', text: person_name) { click_button 'Save' }

    within('.card.show', text: person_name) do
      error_messages.each do |message|
        expect(page).to have_content(message, count: 1)
      end
      click_link 'Edit'
    end

    within('.card.edit', text: person_name) do
      error_messages.each do |message|
        expect(page).to have_content(message, count: 1)
      end
    end

    yield # make field valid to clear errors

    # Participant is not an ActiveModel, so we can't use assign_attributes
    person_updates.each do |attribute, value|
      person.send("#{attribute}=", value)
    end

    stub_request(
      :put,
      intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
    ).and_return(json_body(person.to_json))

    within('.card.edit', text: person_name) do
      error_messages.each do |message|
        expect(page).not_to have_content(message)
      end
      click_button 'Save'
    end

    within('.card.show', text: person_name) do
      error_messages.each do |message|
        expect(page).not_to have_content(message)
      end
    end
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
