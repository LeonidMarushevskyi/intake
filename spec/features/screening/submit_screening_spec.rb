# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Submit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  before do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
  end

  context 'when successfully submmitting referral' do
    before do
      stub_request(:post, intake_api_screening_submit_url(existing_screening.id))
        .and_return(status: 200)
    end

    scenario 'displays a success alert and submits a screening to the API' do
      Feature.run_with_activated(:referral_submit) do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'
        expect(
          a_request(:post, intake_api_screening_submit_url(existing_screening.id))
        ).to have_been_made
        expect(page.driver.browser.switch_to.alert.text).to eq('Successfully submitted screening')
        page.driver.browser.switch_to.alert.accept
      end
    end
  end

  context 'when error submitting referral' do
    let(:error_json) { 'Unable to process JSON' }
    before do
      stub_request(:post, intake_api_screening_submit_url(existing_screening.id))
        .and_return(json_body(error_json, status: 400))
    end

    scenario 'displays alert with the error responseText' do
      Feature.run_with_activated(:referral_submit) do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'
        expect(
          a_request(:post, intake_api_screening_submit_url(existing_screening.id))
        ).to have_been_made
        expect(page.driver.browser.switch_to.alert.text).to include(error_json)
        page.driver.browser.switch_to.alert.accept
      end
    end
  end

  context 'when referral submit is deactivated' do
    scenario 'The user submits and clicks proceed' do
      Feature.run_with_deactivated(:referral_submit) do
        visit edit_screening_path(existing_screening.id)
        click_button 'Submit'

        within '#submitModal' do
          expect(page).to have_content 'You have completed the process to submit a screening.'
          click_button 'Proceed'
          expect(page).to have_current_path('/')
        end
      end
    end

    scenario 'The user submits the screening and clicks cancel' do
      Feature.run_with_deactivated(:referral_submit) do
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
end
