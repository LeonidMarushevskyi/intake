# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Submit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  before do
    no_screenings = []
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(existing_screening.id)))
      .and_return(json_body(existing_screening.to_json, status: 200))
    stub_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(no_screenings.to_json, status: 200))
  end

  context 'when referral submit is activated' do
    around do |example|
      Feature.run_with_activated(:referral_submit) do
        example.run
      end
    end

    context 'when successfully submmitting referral' do
      let(:screening_with_referral) do
        FactoryGirl.create(
          :screening,
          referral_id: FFaker::Guid.guid
        )
      end
      before do
        stub_request(
          :post, host_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(screening_with_referral.to_json, status: 201))
      end

      scenario 'displays a success modal and submits a screening to the API' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        expect(
          a_request(
            :post, host_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made

        expect(alert_dialog.text).to eq(
          "Successfully created referral #{screening_with_referral.referral_id}"
        )
        alert_dialog.accept

        within '#submitModal' do
          expect(page).to have_content 'You have completed the process to submit a screening.'
        end
      end
    end

    context 'when error submitting referral' do
      let(:error_json) { 'Unable to process JSON' }
      before do
        stub_request(
          :post, host_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(error_json, status: 400))
      end

      scenario 'displays a success modal and alert with the error responseText' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'
        expect(
          a_request(
            :post, host_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made

        expect(alert_dialog.text).to include(error_json)
        alert_dialog.accept

        within '#submitModal' do
          expect(page).to have_content 'You have completed the process to submit a screening.'
        end
      end
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
