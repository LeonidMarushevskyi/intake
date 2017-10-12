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
        Capybara::Accessible::Auditor.disable
        example.run
        Capybara::Accessible::Auditor.enable
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
      let(:error_json) { 'Unable to process JSON' }
      before do
        stub_request(
          :post,
          intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
        ).and_return(json_body(error_json, status: 400))
      end

      scenario 'displays a success modal and alert with the error responseText' do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'
        expect(
          a_request(
            :post,
            intake_api_url(ExternalRoutes.intake_api_screening_submit_path(existing_screening.id))
          )
        ).to have_been_made

        expect(page).not_to have_content '#submitModal'
        expect(page).not_to have_content ' - Referral #'
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
