# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Person Information Validations' do
  let(:screening) { FactoryGirl.create :screening, participants: [person] }
  let(:person_name) { "#{person.first_name} #{person.last_name}" }

  before do
    stub_and_visit_edit_screening(screening)
  end

  context 'victim first name is not present' do
    let(:invalid_first_name) { nil }
    let(:valid_first_name) { 'John' }
    let(:person) do
      FactoryGirl.create :participant,
        first_name: invalid_first_name,
        roles: ['Victim', 'Family Member']
    end
    let(:error_message) { 'Please enter a first name.' }

    scenario 'error is displayed until user enters a valid first name' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { first_name: valid_first_name }
      ) do
        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
        end
      end
    end

    scenario 'error is not displayed if the victim role is removed' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { roles: [] }
      ) do
        within edit_participant_card_selector(person.id) do
          remove_react_select_option('Role', 'Victim')
        end
      end
    end
  end

  context 'victim last name is not present' do
    let(:invalid_last_name) { nil }
    let(:valid_last_name) { 'Dow' }
    let(:person) do
      FactoryGirl.create :participant,
        last_name: invalid_last_name,
        roles: ['Victim', 'Family Member']
    end
    let(:error_message) { 'Please enter a last name.' }

    scenario 'error is displayed until user enters a valid last name' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { last_name: valid_last_name }
      ) do
        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
        end
      end
    end

    scenario 'error is not displayed if the victim role is removed' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { roles: [] }
      ) do
        within edit_participant_card_selector(person.id) do
          remove_react_select_option('Role', 'Victim')
        end
      end
    end
  end

  context 'collateral first name is not present' do
    let(:invalid_first_name) { nil }
    let(:valid_first_name) { 'John' }
    let(:person) do
      FactoryGirl.create :participant,
        first_name: invalid_first_name,
        roles: ['Collateral', 'Family Member']
    end
    let(:error_message) { 'Please enter a first name.' }

    scenario 'error is displayed until user enters a valid first name' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { first_name: valid_first_name }
      ) do
        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
        end
      end
    end

    scenario 'error is not displayed if the victim role is removed' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { roles: [] }
      ) do
        within edit_participant_card_selector(person.id) do
          remove_react_select_option('Role', 'Collateral')
        end
      end
    end
  end

  context 'collateral last name is not present' do
    let(:invalid_last_name) { nil }
    let(:valid_last_name) { 'Dow' }
    let(:person) do
      FactoryGirl.create :participant,
        last_name: invalid_last_name,
        roles: ['Collateral', 'Family Member']
    end
    let(:error_message) { 'Please enter a last name.' }

    scenario 'error is displayed until user enters a valid last name' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { last_name: valid_last_name }
      ) do
        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
        end
      end
    end

    scenario 'error is not displayed if the victim role is removed' do
      expect(page).to have_content person_name
      validate_message_as_user_interacts_with_person_card(
        person: person,
        error_message: error_message,
        person_updates: { roles: [] }
      ) do
        within edit_participant_card_selector(person.id) do
          remove_react_select_option('Role', 'Collateral')
        end
      end
    end
  end

  context 'ssn is not valid' do
    let(:valid_ssn) { '123-45-6789' }
    let(:person) { FactoryGirl.create :participant, ssn: invalid_ssn }

    context 'ssn has all zeros in the first group' do
      let(:invalid_ssn) { '000-12-3456' }
      let(:error_message) { 'Social security number cannot contain all 0s in a group.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn has all zeros in the second group' do
      let(:invalid_ssn) { '123-00-4567' }
      let(:error_message) { 'Social security number cannot contain all 0s in a group.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn has all zeros in the third group' do
      let(:invalid_ssn) { '123-45-0000' }
      let(:error_message) { 'Social security number cannot contain all 0s in a group.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn has all zeros in more than one group' do
      let(:invalid_ssn) { '000-00-0000' }
      let(:error_message) { 'Social security number cannot contain all 0s in a group.' }

      scenario 'error is displayed only once until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn begins with a 9' do
      let(:invalid_ssn) { '987-65-4321' }
      let(:error_message) { 'Social security number cannot begin with 9.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn is less than 9 digits long and does not contain hyphens or underscores' do
      let(:invalid_ssn) { '98765432' }
      let(:error_message) { 'Social security number must be 9 digits long.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn is less than 9 digits long and contains hyphens' do
      let(:invalid_ssn) { '987-65-432' }
      let(:error_message) { 'Social security number must be 9 digits long.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn is less than 9 digits long and contains underscores' do
      let(:invalid_ssn) { '9876543__' }
      let(:error_message) { 'Social security number must be 9 digits long.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn starts with 666' do
      let(:invalid_ssn) { '666-65-432' }
      let(:error_message) { 'Social security number cannot begin with 666.' }

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_message: error_message,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end

    context 'ssn has more than one error' do
      let(:invalid_ssn) { '666-00-432' }
      let(:error_messages) do
        [
          'Social security number cannot begin with 666.',
          'Social security number cannot contain all 0s in a group.'
        ]
      end

      scenario 'error is displayed until user enters a valid ssn' do
        expect(page).to have_content person_name
        validate_message_as_user_interacts_with_person_card(
          person: person,
          error_messages: error_messages,
          person_updates: { ssn: valid_ssn }
        ) do
          within '.card', text: person_name do
            fill_in 'Social security number', with: valid_ssn
          end
        end
      end
    end
  end

  context 'ssn is nil' do
    let(:person) { FactoryGirl.create :participant, ssn: nil }
    let(:error_messages) do
      [
        'Social security number cannot begin with 666.',
        'Social security number cannot contain all 0s in a group.',
        'Social security number must be 9 digits long.',
        'Social security number cannot begin with 9.'
      ]
    end

    scenario 'no error is displayed' do
      stub_request(
        :put,
        intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
      ).and_return(json_body(person.to_json))

      within('.card.edit', text: person_name) { click_button 'Save' }

      within('.card.show', text: person_name) do
        error_messages.each do |message|
          expect(page).not_to have_content(message, count: 1)
        end
        click_link 'Edit'
      end

      within('.card.edit', text: person_name) do
        error_messages.each do |message|
          expect(page).not_to have_content(message, count: 1)
        end
      end
    end
  end
end
