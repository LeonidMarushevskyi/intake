# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Show Screening' do
  scenario 'showing existing screening' do
    address = FactoryGirl.create(
      :address,
      street_address: '123 fake st',
      city: 'Springfield',
      state: 'NY',
      zip: '12345'
    )
    existing_screening = FactoryGirl.create(
      :screening,
      additional_information: 'The reasoning for this decision',
      address: address,
      assignee: 'Bob Loblaw',
      communication_method: 'mail',
      ended_at: '2016-08-22T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      location_type: "Child's Home",
      name: 'The Rocky Horror Picture Show',
      reference: 'My Bad!',
      report_narrative: 'some narrative',
      screening_decision: 'screen_out',
      screening_decision_detail: 'consultation',
      started_at: '2016-08-13T10:00:00.000Z',
      cross_reports: [
        { agency_type: 'District attorney', agency_name: 'SCDA' },
        { agency_type: 'Licensing' }
      ]
    )

    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))

    visit screening_path(id: existing_screening.id)

    expect(page).to have_content 'Screening #My Bad!'

    within '#screening-information-card.show', text: 'SCREENING INFORMATION' do
      expect(page).to have_content 'The Rocky Horror Picture Show'
      expect(page).to have_content 'Bob Loblaw'
      expect(page).to have_content '8/13/2016 10:00 AM'
      expect(page).to have_content '8/22/2016 11:00 AM'
      expect(page).to have_content 'Mail'
    end

    within '#narrative-card.show', text: 'NARRATIVE' do
      expect(page).to have_content 'some narrative'
    end

    within '#incident-information-card.show', text: 'INCIDENT INFORMATION' do
      expect(page).to have_content '8/11/2016'
      expect(page).to have_content 'Sacramento'
      expect(page).to have_content '123 fake st'
      expect(page).to have_content 'Springfield'
      expect(page).to have_content 'New York'
      expect(page).to have_content '12345'
      expect(page).to have_content "Child's Home"
    end

    within '#decision-card.show', text: 'DECISION' do
      expect(page).to have_content 'Screen out'
      expect(page).to have_content 'Category'
      expect(page).to have_content 'Consultation'
      expect(page).to have_content 'The reasoning for this decision'
    end

    within '#allegations-card.show', text: 'ALLEGATIONS' do
      expect(page).to have_css('th', text: 'Alleged Victim/Children')
      expect(page).to have_css('th', text: 'Alleged Perpetrator')
      expect(page).to have_css('th', text: 'Allegation(s)')
    end

    within '#worker-safety-card', text: 'WORKER SAFETY' do
      expect(page).to have_css('i', class: 'fa-pencil')
      expect(page).to have_content('Worker safety alerts')
      expect(page).to have_content('Additional safety information')
    end

    expect(page).to have_css('#history-card.show', text: 'HISTORY')

    within '#cross-report-card', text: 'CROSS REPORT' do
      expect(page).to have_content 'District attorney'
      expect(page).to have_content 'SCDA'
      expect(page).to have_content 'Licensing'
      click_link 'Edit cross report'
      expect(page).to have_field('District_attorney-agency-name', with: 'SCDA')

      da_input = find_field('District_attorney-agency-name')
      10.times do
        da_input.send_keys [:backspace]
      end
      expect(page).to have_field('District_attorney-agency-name', with: '')
    end

    expect(page).to have_link('Home', href: root_path)
    expect(page).to have_link('Edit', href: edit_screening_path(id: existing_screening.id))
  end
end
