# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Screening Information Validations' do
  let(:screening) { FactoryGirl.create(:screening) }
  let(:card_name) { 'screening-information' }

  # rubocop:disable Metrics/AbcSize
  def validate_message_as_user_interacts_with_card(error_message:, screening_updates:)
    edit_view_should_not_have_error(card_name, error_message)
    stub_screening_put_request_with_anything(screening)
    save_card(card_name)

    show_view_should_have_error(card_name, error_message)
    edit_card(card_name)

    edit_view_should_have_error(card_name, error_message)

    yield # make field valid to clear errors

    stub_screening_put_request_with_anything(screening, with_updated_attributes: screening_updates)
    save_card(card_name)
    show_view_should_not_have_error(card_name, error_message)
  end

  context 'On the edit page' do
    before do
      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))

      visit edit_screening_path(id: screening.id)

      # TODO: remove this once we can consistently have a fresh page for these specs
      page.evaluate_script('window.location.reload()')
    end

    context 'social worker field' do
      let(:error_message) { 'Please enter an assigned worker.' }

      scenario 'displays errors if a user does not enter a social worker' do
        within '#screening-information-card.edit' do
          page.find('.card-body').native.click
          expect(page).not_to have_content(error_message)
          js_simulate('focus', on: '#assignee')
          expect(page).not_to have_content(error_message)
          js_simulate('blur', on: '#assignee')
          expect(page).to have_content(error_message)
          fill_in 'Assigned Social Worker', with: 'My Name'
          js_simulate('blur', on: '#assignee')
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'show card displays errors until user adds a social worker' do
        validate_message_as_user_interacts_with_card(
          error_message: error_message,
          screening_updates: { assignee: 'My Name' }
        ) do
          within '#screening-information-card.edit' do
            fill_in 'Assigned Social Worker', with: 'My Name'
            page.first('*').click
          end
        end
      end
    end

    context 'communication method field' do
      let(:error_message) { 'Please select a communication method.' }

      scenario 'displays errors if a user does not enter a communication method' do
        within '#screening-information-card.edit' do
          page.find('.card-body').native.click
          expect(page).not_to have_content(error_message)
          js_simulate('focus', on: '#communication_method')
          expect(page).not_to have_content(error_message)
          js_simulate('blur', on: '#communication_method')
          expect(page).to have_content(error_message)
          js_simulate('focus', on: '#communication_method')
          select 'Email', from: 'Communication Method'
          js_simulate('blur', on: '#communication_method')
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'show card displays errors until user adds a communication method' do
        validate_message_as_user_interacts_with_card(
          error_message: error_message,
          screening_updates: { communication_method: 'email' }
        ) do
          within '#screening-information-card.edit' do
            select 'Email', from: 'Communication Method'
            page.first('*').click
          end
        end
      end
    end

    context 'end date field' do
      let(:error_message) { 'The end date and time cannot be in the future.' }

      scenario 'displays an error if the date is in the future' do
        within '#screening-information-card.edit' do
          expect(page).not_to have_content(error_message)
          fill_in_datepicker 'Screening End Date/Time', with: 20.years.from_now, blur: false
          expect(page).not_to have_content(error_message)
          page.find('#name').native.click
          expect(page).to have_content(error_message)
          fill_in_datepicker 'Screening End Date/Time', with: 20.years.ago, blur: true
          expect(page).not_to have_content(error_message)
        end
      end

      context 'with a screening saved with end date in the future' do
        let(:screening) do
          FactoryGirl.create(:screening, ended_at: 30.years.from_now)
        end
        let(:valid_date) { 20.years.ago.iso8601 }

        scenario 'show card shows errors until the date is in the future' do
          validate_message_as_user_interacts_with_card(
            error_message: error_message,
            screening_updates: { ended_at: valid_date }
          ) do
            within '#screening-information-card.edit' do
              fill_in_datepicker 'Screening End Date/Time', with: valid_date
            end
          end
        end
      end
    end

    context 'start date field' do
      scenario 'displays an error if the user does not enter a start date' do
        error_message = 'Please enter a screening start date.'

        within '#screening-information-card.edit' do
          expect(page).not_to have_content(error_message)
          page.find('#started_at').native.click
          expect(page).not_to have_content(error_message)
          page.find('#name').native.click
          expect(page).to have_content(error_message)
          fill_in_datepicker 'Screening Start Date/Time', with: '08/17/2016 3:00 AM'
          page.find('#name').native.click
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'displays an error if the user enters a start date in the future' do
        error_message = 'The start date and time cannot be in the future.'

        within '#screening-information-card.edit' do
          expect(page).not_to have_content(error_message)
          fill_in_datepicker 'Screening Start Date/Time', with: 20.years.from_now, blur: false
          expect(page).not_to have_content(error_message)
          page.find('#name').native.click
          expect(page).to have_content(error_message)
          fill_in_datepicker 'Screening Start Date/Time', with: 20.years.ago, blur: true
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'displays an error if the user enters a start date that is after the end date' do
        error_message = 'The start date and time must be before the end date and time.'

        within '#screening-information-card.edit' do
          fill_in_datepicker 'Screening End Date/Time', with: 20.years.ago
          expect(page).not_to have_content(error_message)
          fill_in_datepicker 'Screening Start Date/Time', with: 10.years.ago, blur: false
          expect(page).not_to have_content(error_message)
          page.find('#name').native.click
          expect(page).to have_content(error_message)
          fill_in_datepicker 'Screening Start Date/Time', with: 30.years.ago, blur: true
          expect(page).not_to have_content(error_message)
        end
      end

      scenario 'show card displays errors until user enters a start date' do
        validate_message_as_user_interacts_with_card(
          error_message: 'Please enter a screening start date.',
          screening_updates: { communication_method: 'email' }
        ) do
          within '#screening-information-card.edit' do
            fill_in_datepicker 'Screening Start Date/Time', with: '08/17/2016 3:00 AM'
          end
        end
      end

      context 'with a screening saved with start date in the future' do
        let(:screening) do
          FactoryGirl.create(:screening, started_at: 20.years.from_now)
        end

        scenario 'show card shows errors until the date is in the past' do
          valid_date = 20.years.ago
          validate_message_as_user_interacts_with_card(
            error_message: 'The start date and time cannot be in the future.',
            screening_updates: { started_at: valid_date.iso8601 }
          ) do
            within '#screening-information-card.edit' do
              fill_in_datepicker 'Screening Start Date/Time', with: valid_date
            end
          end
        end
      end

      context 'With a screening saved with start dates after the end date' do
        let(:screening) do
          FactoryGirl.create(:screening, started_at: 10.years.ago, ended_at: 20.years.ago)
        end

        scenario 'show card shows errors until the start date is before the end date' do
          valid_date = 30.years.ago
          validate_message_as_user_interacts_with_card(
            error_message: 'The start date and time must be before the end date and time.',
            screening_updates: { started_at: valid_date.iso8601 }
          ) do
            within '#screening-information-card.edit' do
              fill_in_datepicker 'Screening Start Date/Time', with: valid_date
            end
          end
        end
      end
    end
  end

  context 'On the show page' do
    before do
      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))

      visit screening_path(id: screening.id)
    end

    scenario 'user sees error messages for required fields page load' do
      within '#screening-information-card.show' do
        expect(page).to have_content('Please enter an assigned worker.')
        expect(page).to have_content('Please select a communication method.')
      end
    end
  end
end
