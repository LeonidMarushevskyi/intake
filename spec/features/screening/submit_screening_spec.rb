# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Submit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening, :submittable) }
  before do
    no_screenings = []
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(no_screenings.to_json, status: 200))
    stub_empty_history_for_screening(existing_screening)
    stub_empty_relationships_for_screening(existing_screening)
    stub_screening_put_request_with_anything_and_return(existing_screening)
  end

  context 'when referral submit is activated' do
    around do |example|
      Feature.run_with_activated(:referral_submit) do
        example.run
      end
    end

    context 'screening has people' do
      let(:participant) { FactoryGirl.create(:participant) }
      let(:existing_screening) do
        FactoryGirl.create(
          :screening,
          :submittable,
          participants: [participant]
        )
      end

      before do
        stub_request(
          :put, intake_api_url(ExternalRoutes.intake_api_participant_path(participant.id))
        ).and_return(json_body(existing_screening.to_json, status: 200))
      end

      scenario 'submit button is disabled until all cards are saved' do
        visit edit_screening_path(existing_screening.id)
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: 'Screening Information') { click_button 'Save' }
        within('.card', text: "#{participant.first_name} #{participant.last_name}") do
          click_button 'Save'
        end
        within('.card', text: 'Narrative') { click_button 'Save' }
        within('.card', text: 'Incident Information') { click_button 'Save' }
        within('.card', text: 'Allegations') { click_button 'Save' }
        within('.card', text: 'Worker Safety') { click_button 'Save' }
        within('.card', text: 'Cross Report') { click_button 'Save' }
        within('.card', text: 'Decision') { click_button 'Save' }
        expect(page).to have_button('Submit', disabled: false)
      end

      scenario 'submit button is disabled if screening cards are saved but person cards are not' do
        visit edit_screening_path(existing_screening.id)
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: 'Screening Information') { click_button 'Save' }
        within('.card', text: 'Narrative') { click_button 'Save' }
        within('.card', text: 'Incident Information') { click_button 'Save' }
        within('.card', text: 'Allegations') { click_button 'Save' }
        within('.card', text: 'Worker Safety') { click_button 'Save' }
        within('.card', text: 'Cross Report') { click_button 'Save' }
        within('.card', text: 'Decision') { click_button 'Save' }
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: "#{participant.first_name} #{participant.last_name}") do
          click_button 'Save'
        end
        expect(page).to have_button('Submit', disabled: false)
      end

      scenario 'submit button is disabled if person cards are saved but screening cards are not' do
        visit edit_screening_path(existing_screening.id)
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: 'Screening Information') { click_button 'Save' }
        within('.card', text: "#{participant.first_name} #{participant.last_name}") do
          click_button 'Save'
        end
        within('.card', text: 'Narrative') { click_button 'Save' }
        within('.card', text: 'Incident Information') { click_button 'Save' }
        within('.card', text: 'Allegations') { click_button 'Save' }
        within('.card', text: 'Worker Safety') { click_button 'Save' }
        within('.card', text: 'Cross Report') { click_button 'Save' }
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: 'Decision') { click_button 'Save' }
        expect(page).to have_button('Submit', disabled: false)
      end
    end

    context 'the screening does not have all of the information to be promoted to a referral' do
      let(:existing_screening) do
        FactoryGirl.create(
          :screening,
          started_at: Time.now,
          assignee: 'Jane Smith',
          report_narrative: 'My narrative',
          screening_decision: 'differential_response'
        )
      end

      scenario 'the submit button is disabled until the screening is valid' do
        visit edit_screening_path(existing_screening.id)
        save_all_cards
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: 'Screening Information') { click_link 'Edit' }

        stub_screening_put_request_with_anything_and_return(
          existing_screening,
          with_updated_attributes: { communication_method: 'fax' }
        )

        within('.card', text: 'Screening Information') do
          select 'Fax', from: 'Communication Method'
          click_button 'Save'
        end
        expect(page).to have_button('Submit', disabled: false)
      end
    end

    context 'a person on the screening does not have all of the information to be valid' do
      let(:person) { FactoryGirl.create(:participant, ssn: '666-12-3456') }
      let(:person_name) { "#{person.first_name} #{person.last_name}" }
      let(:existing_screening) do
        FactoryGirl.create(
          :screening,
          started_at: Time.now,
          assignee: 'Jane Smith',
          report_narrative: 'My narrative',
          screening_decision: 'differential_response',
          communication_method: 'fax',
          participants: [person]
        )
      end

      scenario 'the submit button is disabled until the person is valid' do
        stub_request(
          :put, intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
        ).and_return(json_body(person.to_json, status: 200))

        visit edit_screening_path(existing_screening.id)
        save_all_cards
        within('.card', text: person_name) { click_button 'Save' }
        expect(page).to have_button('Submit', disabled: true)
        within('.card', text: person_name) { click_link 'Edit' }

        person.ssn = '123-45-6789'
        stub_request(
          :put,
          intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
        ).and_return(json_body(person.to_json))

        within('.card', text: person_name) do
          fill_in 'Social security number', with: '123-45-6789'
          click_button 'Save'
        end

        expect(page).to have_button('Submit', disabled: false)
      end
    end

    context 'when successfully submmitting referral' do
      let(:referral_id) { FFaker::Guid.guid }
      let(:screening_with_referral) do
        FactoryGirl.create(
          :screening,
          :submittable,
          referral_id: referral_id
        )
      end
      before do
        stub_empty_history_for_screening(existing_screening)
        stub_request(
          :post,
          intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(screening_with_referral.to_json, status: 201))
      end

      scenario 'does not display an error banner with count of errors' do
        visit edit_screening_path(existing_screening.id)
        save_all_cards
        click_button 'Submit'

        expect(page).to_not have_css('.page-error')
      end

      scenario 'does not display an error alert with details of errors' do
        visit edit_screening_path(existing_screening.id)
        save_all_cards
        click_button 'Submit'

        expect(page).to_not have_css('.error-message')
      end

      scenario 'displays a success modal and submits a screening to the API' do
        visit edit_screening_path(existing_screening.id)
        save_all_cards
        click_button 'Submit'

        expect(
          a_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made

        expect(page).not_to have_content '#submitModal'
        expect(page).to have_content "Referral ##{referral_id}"
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
        stub_empty_history_for_screening(existing_screening)
        visit edit_screening_path(existing_screening.id)
        stub_request(
          :post,
          intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(errors.to_json, status: 422))

        visit edit_screening_path(existing_screening.id)
        save_all_cards
        click_button 'Submit'

        expect(
          a_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made
      end
      scenario 'displays an error banner with count of errors' do
        expect(page).not_to have_content 'Referral #'
        expect(
          page.find('.page-error')
        ).to have_content(
          '8 error(s) have been identified. Please fix them and try submitting again.'
        )
      end
      scenario 'displays an error alert with details of errors' do
        expect(page).not_to have_content 'Referral #'
        expect(page.find('.error-message div.alert-icon')).to have_css('i.fa-warning')
        expect(
          page.all('.error-message div.alert-text li').map(&:text)
        ).to eq(
          [
            "screeningDecision may not be empty (Ref #: #{incident_id})",
            "approvalStatus must be a valid system code for ... (Ref #: #{incident_id})",
            "communicationMethod must be a valid system code for ... (Ref #: #{incident_id})",
            "responseTime must be a valid system code for ... (Ref #: #{incident_id})",
            "incidentCounty.GVR_ENTC GVR_ENTC sys code is ... (Ref #: #{incident_id})",
            "participants must contain at least one victim, ... (Ref #: #{incident_id})",
            "id must be greater than or equal to 1 (Ref #: #{incident_id})",
            "responseTime may not be null (Ref #: #{incident_id})"
          ]
        )
      end
    end
  end
end
