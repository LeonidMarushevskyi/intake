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

  scenario 'displays a success modal and submits a screening to the API' do
    Feature.run_with_activated(:referral_submit) do
      visit edit_screening_path(id: existing_screening.id)
      click_button 'Submit'
      expect(a_request(:post, intake_api_screening_submit_url(existing_screening.id))).to have_been_made
      expect(page).to have_content 'Congratulations! You have completed the process to submit a screening.'
    end
  end

  context 'when referral_submit is OFF' do
    scenario 'displays a success modal and does NOT submit screening to the API' do
      Feature.run_with_deactivated(:referral_submit) do
        visit edit_screening_path(id: existing_screening.id)
        click_button 'Submit'
        expect(a_request(:post, intake_api_screening_submit_url(existing_screening.id))).to_not have_been_made
        expect(page).to have_content 'Congratulations! You have completed the process to submit a screening.'
      end
    end
  end
end
