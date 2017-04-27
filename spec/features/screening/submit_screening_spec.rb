# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Submit Screening' do
  scenario 'click submit on a screening edit page' do
    existing_screening = FactoryGirl.create(:screening)
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)
    click_button 'Submit'
    expect(a_request(:post, intake_api_screening_submit_url(existing_screening.id))).to have_been_made
    expect(page).to have_content 'Congratulations! You have completed the process to submit a screening.'
  end
end
