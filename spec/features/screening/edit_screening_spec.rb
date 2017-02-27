# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  scenario 'edit an existing screening' do
    existing_screening = FactoryGirl.create(
      :screening,
      assignee: 'Bob Loblaw',
      communication_method: 'phone',
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      name: 'Little Shop Of Horrors',
      reference: 'My Bad!',
      report_narrative: 'Narrative 123 test',
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00:00.000Z'
    )

    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: existing_screening.id)
    expect(page).to have_content 'Edit Screening #My Bad!'

    within '#screening-information-card' do
      expect(page).to have_field('Title/Name of Screening', with: 'Little Shop Of Horrors')
      expect(page).to have_field('Assigned Social Worker', with: 'Bob Loblaw')
      expect(page).to have_field('Screening Start Date/Time', with: '2016-08-13T10:00:00.000Z')
      expect(page).to have_field('Screening End Date/Time', with: '2016-08-13T11:00:00.000Z')
      expect(page).to have_field('Communication Method', with: 'phone')
    end

    within '#narrative-card' do
      expect(page).to have_field('Report Narrative', with: 'Narrative 123 test')
    end

    within '#incident-information-card', text: 'INCIDENT INFORMATION' do
      expect(page).to have_field('Incident Date', with: '2016-08-11')
      expect(page).to have_field('Incident County', with: 'sacramento')
      expect(page).to have_field('Response Time', with: 'immediate')
      expect(page).to have_field('Screening Decision', with: 'evaluate_out')
    end

    within '#screening-history-card', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end
end
