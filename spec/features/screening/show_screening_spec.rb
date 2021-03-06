# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'factory_bot'
require 'feature/testing'

feature 'Show Screening' do
  let(:address) do
    FactoryBot.create(
      :address,
      street_address: '123 fake st',
      city: 'Springfield',
      state: 'NY',
      zip: '12345'
    )
  end
  let(:existing_screening) do
    FactoryBot.create(
      :screening,
      additional_information: 'The reasoning for this decision',
      address: address,
      assignee: 'Bob Loblaw',
      communication_method: 'mail',
      ended_at: '2016-08-22T11:00:00.000Z',
      incident_county: '34',
      incident_date: '2016-08-11',
      location_type: "Child's Home",
      name: 'The Rocky Horror Picture Show',
      reference: 'My Bad!',
      report_narrative: 'some narrative',
      screening_decision: 'screen_out',
      screening_decision_detail: 'consultation',
      started_at: '2016-08-13T10:00:00.000Z',
      cross_reports: [
        {
          county_id: 'c41',
          agencies: [
            { id: '45Hvp7x00F', type: 'DISTRICT_ATTORNEY' },
            { type: 'COUNTY_LICENSING' }
          ]
        }
      ]
    )
  end

  scenario 'showing screening side bar' do
    stub_county_agencies('c41')
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)

    within '.side-bar' do
      expect(page.find('a.link', text: 'Screening Information')[:href])
        .to include('#screening-information-card-anchor')
      expect(page.find('a.link', text: 'Narrative')[:href])
        .to include('#narrative-card-anchor')
      expect(page.find('a.link', text: 'Incident Information')[:href])
        .to include('#incident-information-card-anchor')
      expect(page.find('a.link', text: 'Allegations')[:href])
        .to include('#allegations-card-anchor')
      expect(page.find('a.link', text: 'Relationships')[:href])
        .to include('#relationships-card-anchor')
      expect(page.find('a.link', text: 'Worker Safety')[:href])
        .to include('#worker-safety-card-anchor')
      expect(page.find('a.link', text: 'History')[:href])
        .to include('#history-card-anchor')
      expect(page.find('a.link', text: 'Cross Report')[:href])
        .to include('#cross-report-card-anchor')
      expect(page.find('a.link', text: 'Decision')[:href])
        .to include('#decision-card-anchor')
    end

    within '.col-md-10' do
      expect(page).to have_css('a.anchor#screening-information-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#narrative-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#incident-information-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#allegations-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#relationships-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#worker-safety-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#history-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#cross-report-card-anchor', visible: false)
      expect(page).to have_css('a.anchor#decision-card-anchor', visible: false)
    end

    expect(page).to have_selector('#decision-card', visible: false)
    click_link 'Decision'
    expect(page).to have_selector('#decision-card', visible: true)
    click_link 'Screening Information'
    expect(page).to have_selector('#screening-information-card', visible: true)
  end

  scenario 'showing existing screening' do
    stub_county_agencies('c41')
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)
    within '.page-header-mast' do
      expect(page).to have_content('The Rocky Horror Picture Show')
    end

    within '#screening-information-card.show', text: 'Screening Information' do
      expect(page.find('label', text: 'Assigned Social Worker')[:class]).to include('required')
      expect(page.find('label', text: 'Screening Start Date/Time')[:class]).to include('required')
      expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
      expect(page).to have_content 'The Rocky Horror Picture Show'
      expect(page).to have_content 'Bob Loblaw'
      expect(page).to have_content '8/13/2016 3:00 AM'
      expect(page).to have_content '8/22/2016 4:00 AM'
      expect(page).to have_content 'Mail'
    end

    within '#narrative-card.show', text: 'Narrative' do
      expect(page).to have_content 'some narrative'
      expect(page.find('label', text: 'Report Narrative')[:class]).to include('required')
    end

    within '#incident-information-card.show', text: 'Incident Information' do
      expect(page).to have_content '8/11/2016'
      expect(page).to have_content 'Sacramento'
      expect(page).to have_content '123 fake st'
      expect(page).to have_content 'Springfield'
      expect(page).to have_content 'New York'
      expect(page).to have_content '12345'
      expect(page).to have_content "Child's Home"
    end

    within '#decision-card.show', text: 'Decision' do
      expect(page.find('label', text: 'Screening decision')[:class]).to include('required')
      expect(page).to have_content 'Screen out'
      expect(page).to have_content 'Category'
      expect(page).to have_content 'Consultation'
      expect(page).to have_content 'The reasoning for this decision'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_css('th', text: 'Alleged Victim/Children')
      expect(page).to have_css('th', text: 'Alleged Perpetrator')
      expect(page).to have_css('th', text: 'Allegation(s)')
    end

    within '#worker-safety-card', text: 'Worker Safety' do
      expect(page).to have_link('Edit')
      expect(page).to have_content('Worker safety alerts')
      expect(page).to have_content('Additional safety information')
    end

    expect(page).to have_css('#history-card.show', text: 'History')

    within '#cross-report-card', text: 'Cross Report' do
      expect(page).to have_content 'District attorney'
      expect(page).to have_content 'LA District Attorney'
      expect(page).to have_content 'County licensing'
      click_link 'Edit cross report'
      expect(page).to have_select('District attorney agency name', selected: 'LA District Attorney')
      select '', from: 'District attorney agency name'
      expect(page).to have_select('District attorney agency name', selected: '')
    end

    expect(page).to have_link('Home', href: root_path)
    expect(page).to have_link('Edit', href: edit_screening_path(id: existing_screening.id))
  end

  context 'when screenings are disabled' do
    around do |example|
      Feature.run_with_deactivated(:screenings) do
        example.run
      end
    end

    scenario 'cannot view an existing screening', browser: :poltergeist do
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).and_return(json_body(existing_screening.to_json))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)
      visit screening_path(id: existing_screening.id)

      expect(page).to have_content('Sorry, this is not the page you want')
    end
  end

  context 'when a screening has already been submitted as a referral' do
    let(:existing_screening) do
      FactoryBot.create(
        :screening,
        referral_id: '123ABC',
        additional_information: 'The reasoning for this decision',
        address: address,
        assignee: 'Bob Loblaw',
        communication_method: 'mail',
        ended_at: '2016-08-22T11:00:00.000Z',
        incident_county: '34',
        incident_date: '2016-08-11',
        location_type: "Child's Home",
        name: 'The Rocky Horror Picture Show',
        reference: 'My Bad!',
        report_narrative: 'some narrative',
        screening_decision: 'screen_out',
        screening_decision_detail: 'consultation',
        started_at: '2016-08-13T10:00:00.000Z',
        cross_reports: [
          { agency_type: 'DISTRICT_ATTORNEY', agency_code: '45Hvp7x00F' },
          { agency_type: 'COUNTY_LICENSING' }
        ]
      )
    end

    before do
      existing_screening.participants = Array.new(3) do
        FactoryBot.create :participant, screening_id: existing_screening.id
      end
    end

    scenario 'the screening is in read only mode' do
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).and_return(json_body(existing_screening.to_json))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)

      visit screening_path(id: existing_screening.id)
      within '.page-header-mast' do
        expect(page).to have_content('The Rocky Horror Picture Show')
      end
      expect(page).to have_content "Referral ##{existing_screening.referral_id}"
      expect(page).to_not have_css('#search-card', text: 'Search')
      expect(page).to_not have_css('.card.edit')
      expect(page).not_to have_button 'Submit'
      expect(page).not_to have_link 'Edit'
      expect(page).not_to have_link 'Save'
      expect(page).not_to have_link 'Cancel'
      expect(page).not_to have_selector '.delete-button'
    end
  end
end
