# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Incident Information Validations' do
  let(:screening) { FactoryGirl.create(:screening) }
  let(:error_message) { 'The incident date and time cannot be in the future.' }

  context 'On the edit page' do
    before do
      stub_and_visit_edit_screening(screening)
    end

    context 'incident date field' do
      scenario 'displays an error if the date is in the future' do
        validate_message_as_user_interacts_with_date_field(
          card_name: 'incident-information',
          field: 'Incident Date',
          error_message: error_message,
          invalid_value: 20.years.from_now,
          valid_value: 20.years.ago
        )
      end

      context 'with a screening saved with incident date in the future' do
        let(:screening) do
          FactoryGirl.create(:screening, incident_date: 30.years.from_now)
        end
        let(:valid_date) { 20.years.ago.iso8601 }

        scenario 'show card shows errors until incident date is not in the future' do
          validate_message_as_user_interacts_with_card(
            card_name: 'incident-information',
            error_message: error_message,
            invalid_screening: screening,
            screening_updates: { incident_date: valid_date }
          ) do
            select_today_from_calendar '#incident_date'
          end
        end
      end
    end
  end

  context 'On the show page' do
    let(:show_card) { '#incident-information-card.show' }
    before do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))

      visit screening_path(id: screening.id)
    end

    scenario 'user sees no error message when incident date field is empty' do
      should_not_have_content error_message, inside: show_card
    end

    context 'for a screening that has incident date in the future' do
      let(:screening) do
        FactoryGirl.create :screening, incident_date: 5.years.from_now
      end

      scenario 'user sees error messages for invalid incident date on page load' do
        should_have_content error_message, inside: show_card
      end
    end
  end
end
