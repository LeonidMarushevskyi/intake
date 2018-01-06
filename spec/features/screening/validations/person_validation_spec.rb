# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Person Information Validations' do
  let(:invalid_first_name) { nil }
  let(:invalid_last_name) { nil }
  let(:valid_first_name) { 'John' }
  let(:valid_last_name) { 'Dow' }
  let(:person) do
    FactoryGirl.create :participant,
      first_name: valid_first_name,
      last_name: valid_last_name
  end
  let(:screening) { FactoryGirl.create :screening, participants: [person] }
  let(:person_name) { "#{person.first_name} #{person.last_name}" }
  let(:last_name_error_message) { 'Please enter a last name.' }
  let(:first_name_error_message) { 'Please enter a first name.' }
  context 'When page is opened in edit mode' do
    before do
      stub_and_visit_edit_screening(screening)
    end

    context 'first name or last name not entered while roles includes Victim role' do
      scenario 'error is displayed until user enters a first name and last name' do
        expect(page).to have_content person_name
        expect(page).to have_no_content(last_name_error_message)
        expect(page).to have_no_content(first_name_error_message)
        within edit_participant_card_selector(person.id) do
          fill_in_react_select('Role', with: 'Victim')
          expect(page).to have_react_select_field('Role', with: ['Victim'])
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: invalid_first_name
          blur_field
          expect(page).to have_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
          blur_field
          expect(page).to have_no_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: invalid_last_name
          blur_field
          expect(page).to have_content(last_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
          blur_field
          expect(page).to have_no_content(last_name_error_message)
        end
      end
    end

    context 'first name or last name not entered while roles includes Collateral role' do
      scenario 'error is displayed until user enters a first name and last name' do
        expect(page).to have_content person_name
        expect(page).to have_no_content(last_name_error_message)
        expect(page).to have_no_content(first_name_error_message)
        within edit_participant_card_selector(person.id) do
          fill_in_react_select('Role', with: 'Collateral')
          expect(page).to have_react_select_field('Role', with: ['Collateral'])
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: invalid_first_name
          blur_field
          expect(page).to have_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
          blur_field
          expect(page).to have_no_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: invalid_last_name
          blur_field
          expect(page).to have_content(last_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
          blur_field
          expect(page).to have_no_content(last_name_error_message)
        end
      end
    end

    context 'first name or last name not entered ' do
      scenario 'while roles does not include Victim or Collateral role error not displayed' do
        expect(page).to have_content person_name
        expect(page).to have_no_content(first_name_error_message)
        expect(page).to have_no_content(last_name_error_message)
        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: invalid_first_name
          blur_field
          expect(page).to have_no_content(first_name_error_message)
        end
        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: invalid_last_name
          blur_field
          expect(page).to have_no_content(last_name_error_message)
        end
      end
    end
  end

  context 'When page is opened in show mode' do
    before do
      stub_and_visit_show_screening(screening)
    end
    context 'first name or last name not entered while roles includes Victim role' do
      scenario 'error is displayed until user enters a first name and last name' do
        expect(page).to have_content person_name
        expect(page).to have_no_content(last_name_error_message)
        expect(page).to have_no_content(first_name_error_message)

        within show_participant_card_selector(person.id) do
          click_link 'Edit person'
        end

        within edit_participant_card_selector(person.id) do
          fill_in_react_select('Role', with: 'Victim')
          expect(page).to have_react_select_field('Role', with: ['Victim'])
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: invalid_first_name
          blur_field
          expect(page).to have_content(first_name_error_message)
          fill_in 'Last Name', with: invalid_last_name
          blur_field
          expect(page).to have_content(last_name_error_message)
          person.roles = ['Victim']
          person.first_name = nil
          person.last_name = nil
          stub_request(
            :put,
            intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
          ).and_return(json_body(person.to_json))
          click_button 'Save'
        end

        within show_participant_card_selector(person.id) do
          expect(page).to have_content(first_name_error_message)
          expect(page).to have_content(last_name_error_message)
          click_link 'Edit person'
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
          blur_field
          expect(page).to have_no_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
          blur_field
          expect(page).to have_no_content(last_name_error_message)
          person.first_name = 'John'
          person.last_name = 'Dow'
          stub_request(
            :put,
            intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
          ).and_return(json_body(person.to_json))
          click_button 'Save'
        end

        within show_participant_card_selector(person.id) do
          expect(page).not_to have_content(first_name_error_message)
          expect(page).not_to have_content(last_name_error_message)
        end
      end
    end

    context 'first name or last name not entered while roles includes Collateral role' do
      scenario 'error is displayed until user enters a first name and last name' do
        expect(page).to have_content person_name
        expect(page).to have_no_content(last_name_error_message)
        expect(page).to have_no_content(first_name_error_message)

        within show_participant_card_selector(person.id) do
          click_link 'Edit person'
        end

        within edit_participant_card_selector(person.id) do
          fill_in_react_select('Role', with: 'Collateral')
          expect(page).to have_react_select_field('Role', with: ['Collateral'])
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: invalid_first_name
          blur_field
          expect(page).to have_content(first_name_error_message)
          fill_in 'Last Name', with: invalid_last_name
          blur_field
          expect(page).to have_content(last_name_error_message)
          person.roles = ['Collateral']
          person.first_name = nil
          person.last_name = nil
          stub_request(
            :put,
            intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
          ).and_return(json_body(person.to_json))
          click_button 'Save'
        end

        within show_participant_card_selector(person.id) do
          expect(page).to have_content(first_name_error_message)
          expect(page).to have_content(last_name_error_message)
          click_link 'Edit person'
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'First Name', with: valid_first_name
          blur_field
          expect(page).to have_no_content(first_name_error_message)
        end

        within edit_participant_card_selector(person.id) do
          fill_in 'Last Name', with: valid_last_name
          blur_field
          expect(page).to have_no_content(last_name_error_message)
          person.first_name = 'John'
          person.last_name = 'Dow'
          stub_request(
            :put,
            intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
          ).and_return(json_body(person.to_json))
          click_button 'Save'
        end

        within show_participant_card_selector(person.id) do
          expect(page).not_to have_content(first_name_error_message)
          expect(page).not_to have_content(last_name_error_message)
        end
      end
    end
  end
end
