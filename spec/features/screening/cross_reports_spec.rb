# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'cross reports' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'adding cross reports to an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)

    reported_on = Date.today.to_s(:db)
    communication_method = 'Electronic Report'

    within '#cross-report-card' do
      expect(page).to_not have_content 'Communication Time and Method'
      find('label', text: 'Department of justice').click
      fill_in 'Department of justice agency name', with: 'Sac Office'
      find('label', text: 'Law enforcement').click
      fill_in 'Law enforcement agency name', with: 'LA Office'
      expect(page).to have_content 'Communication Time and Method'
      fill_in 'Cross Reported on Date', with: reported_on
      select communication_method, from: 'Communication Method'
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_screening_url(existing_screening.id))
      .with(
        body: hash_including(
          'cross_reports' => array_including(
            hash_including(
              'agency_type' => 'Law enforcement',
              'agency_name' => 'LA Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            ),
            hash_including(
              'agency_type' => 'Department of justice',
              'agency_name' => 'Sac Office',
              'reported_on' => reported_on,
              'communication_method' => communication_method
            )
          )
        )
      )
    ).to have_been_made
  end
end
