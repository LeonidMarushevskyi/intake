# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  scenario 'edit an existing screening' do
    existing_screening = FactoryGirl.create(
      :screening,
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      communication_method: 'phone',
      name: 'Little Shop Of Horrors',
      report_narrative: 'Narrative 123 test',
      reference: 'My Bad!',
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00:00.000Z',
      updated_at: '2016-10-21T16:11:59.484Z',
      created_at: '2016-10-21T16:11:59.484Z'
    )

    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: existing_screening.id)
    expect(page).to have_content 'Edit Screening #My Bad!'

    within '#screening-information-card' do
      expect(page).to have_field('Title/Name of Screening', with: 'Little Shop Of Horrors')
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

    within '#screening-information-card' do
      fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'
      fill_in 'Screening Start Date/Time', with: '2016-08-13T10:00.000Z'
      fill_in 'Screening End Date/Time', with: '2016-08-22T11:00.000Z'
      select  'Mail', from: 'Communication Method'
    end

    within '#narrative-card' do
      fill_in 'Report Narrative', with: 'Updated narrative'
    end

    within '#incident-information-card', text: 'INCIDENT INFORMATION' do
      fill_in 'Incident Date', with: '2016-08-11'
      select  'Mariposa', from: 'Incident County'
      within 'fieldset', text: 'Incident Address' do
        fill_in 'Address', with: '123 fake st'
        fill_in 'City', with: 'Springfield'
        select 'New York', from: 'State'
        fill_in 'Zip', with: '12345'
      end
      select "Child's Home", from: 'Location Type'
    end

    within '#screening-history-card', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end

    existing_screening.assign_attributes(
      communication_method: 'mail',
      ended_at: '2016-08-22T11:00.000Z',
      incident_county: 'mariposa',
      incident_date: '2016-08-11',
      location_type: "Child's Home",
      name: 'The Rocky Horror Picture Show',
      reference: 'My Bad!',
      report_narrative: 'Updated narrative',
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00.000Z'
    )
    existing_screening.address.assign_attributes(
      city: 'Springfield',
      state: 'NY',
      street_address: '123 fake st',
      zip: '12345'
    )

    stub_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(existing_screening.to_json(except: :id)))
      .and_return(json_body(existing_screening.to_json))

    stub_request(:get, api_screening_path(existing_screening.id))
      .with(json_body(existing_screening.to_json))
      .and_return(json_body(existing_screening.to_json))

    page.find('button:last-child', text: 'Save').click

    expect(
      a_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(existing_screening.to_json(except: :id)))
    ).to have_been_made.twice

    expect(page).to_not have_content 'Edit Screening'
    expect(page).to have_content 'Screening #My Bad!'
  end
end
