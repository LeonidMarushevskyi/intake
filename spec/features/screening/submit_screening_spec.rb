# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Submit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  before do
    no_screenings = []
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(no_screenings.to_json, status: 200))
  end

  context 'when referral submit is activated' do
    around do |example|
      Feature.run_with_activated(:referral_submit) do
        example.run
      end
    end

    context 'when successfully submmitting referral' do
      let(:referral_id) { FFaker::Guid.guid }
      let(:screening_with_referral) do
        FactoryGirl.create(
          :screening,
          referral_id: referral_id
        )
      end
      before do
        stub_request(
          :post,
          intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(screening_with_referral.to_json, status: 201))
      end

      scenario 'does not display an error banner with count of errors' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        within '.page-error' do
          expect(page).to_not have_content(
            'error(s) have been identified. Please fix them and try submitting again.'
          )
        end
      end

      scenario 'does not display an error alert with details of errors' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        expect(page).to_not have_css('.error-message')
      end

      scenario 'displays a success modal and submits a screening to the API' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        expect(
          a_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made

        expect(page).not_to have_content '#submitModal'
        expect(page).to have_content " - Referral ##{referral_id}"
        expect(page).not_to have_content 'Submit'
      end
    end

    context 'when error submitting referral' do
      let(:incident_id) { '0de2aea9-04f9-4fc4-bc16-75b6495839e0' }
      let(:errors) do
        {
          issue_details: [
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'may not be empty',
              property: 'screeningDecision'
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'must be a valid system code for ...',
              property: 'approvalStatus',
              invalid_value: 0
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'must be a valid system code for ...',
              property: 'communicationMethod'
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'must be a valid system code for ...',
              property: 'responseTime'
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'GVR_ENTC sys code is ...',
              property: 'incidentCounty.GVR_ENTC'
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'must contain at least one victim, ...',
              property: 'participants'
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'must be greater than or equal to 1',
              property: 'id',
              invalid_value: 0
            },
            {
              incident_id: incident_id,
              type: 'constraint_validation',
              user_message: 'may not be null',
              property: 'responseTime'
            }
          ]
        }
      end
      before do
        stub_request(
          :post,
          intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(errors.to_json, status: 422))

        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        expect(
          a_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made
      end
      scenario 'displays an error banner with count of errors' do
        expect(page).not_to have_content ' - Referral #'
        expect(
          page.find('.page-error')
        ).to have_content(
          '8 error(s) have been identified. Please fix them and try submitting again.'
        )
      end
      scenario 'displays an error alert with details of errors' do
        expect(page).not_to have_content ' - Referral #'
        expect(page.find('.error-message div.alert-icon')).to have_css('i.fa-warning')
        expect(
          page.all('.error-message div.alert-text li').map(&:text)
        ).to eq(
          [
            "screeningDecision may not be empty (Incident Id: #{incident_id})",
            "approvalStatus must be a valid system code for ... (Incident Id: #{incident_id})",
            "communicationMethod must be a valid system code for ... (Incident Id: #{incident_id})",
            "responseTime must be a valid system code for ... (Incident Id: #{incident_id})",
            "incidentCounty.GVR_ENTC GVR_ENTC sys code is ... (Incident Id: #{incident_id})",
            "participants must contain at least one victim, ... (Incident Id: #{incident_id})",
            "id must be greater than or equal to 1 (Incident Id: #{incident_id})",
            "responseTime may not be null (Incident Id: #{incident_id})"
          ]
        )
      end
    end
  end

  context 'when release_two is active' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end
    scenario 'The user submits and clicks proceed' do
      visit edit_screening_path(existing_screening.id)
      expect(page).not_to have_button('Submit')
    end
  end

  context 'when referral submit is deactivated' do
    around do |example|
      Feature.run_with_deactivated(:referral_submit) do
        example.run
      end
    end

    scenario 'The user submits and clicks proceed' do
      visit edit_screening_path(existing_screening.id)
      click_button 'Submit'

      within '#submitModal' do
        expect(page).to have_content 'You have completed the process to submit a screening.'
        click_button 'Proceed'
        expect(page).to have_current_path('/')
      end
    end

    scenario 'The user submits the screening and clicks cancel' do
      visit edit_screening_path(existing_screening.id)
      click_button 'Submit'

      within '#submitModal' do
        within '.modal-footer' do
          click_button 'Close'
        end
        expect(page).to have_current_path(edit_screening_path(id: existing_screening.id))
      end
    end
  end
end
