# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Edit Screening' do
  let(:address) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Faketown',
      state: 'DE',
      zip: '20134'
    )
  end
  let(:existing_screening) do
    FactoryGirl.create(
      :screening,
      additional_information: 'This is why I decided what I did',
      address: address,
      assignee: 'Bob Loblaw',
      communication_method: 'phone',
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      name: 'Little Shop Of Horrors',
      reference: 'My Bad!',
      safety_alerts: ['Dangerous Animal on Premises', 'Firearms in Home'],
      safety_information: 'Potential safety alert: dangerous dog at home.',
      report_narrative: 'Narrative 123 test',
      screening_decision: 'screen_out',
      screening_decision_detail: 'information_request',
      started_at: '2016-08-13T10:00:00.000Z',
      cross_reports: [
        {
          county_id: 'c42',
          agencies: [
            { id: '45Hvp7x00F', type: 'DISTRICT_ATTORNEY' },
            { type: 'LAW_ENFORCEMENT' }
          ]
        }
      ]
    )
  end

  context 'when no releases are enabled' do
    before(:each) do
      stub_county_agencies('c42')
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).and_return(json_body(existing_screening.to_json, status: 200))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)
      visit edit_screening_path(id: existing_screening.id)
      expect(page).to have_content 'Edit Screening #My Bad!'
    end

    scenario 'edit an existing screening' do
      within '#screening-information-card.edit', text: 'Screening Information' do
        expect(page.find('label', text: 'Assigned Social Worker')[:class]).to include('required')
        expect(page.find('label', text: 'Screening Start Date/Time')[:class]).to include('required')
        expect(page.find('label', text: 'Communication Method')[:class]).to include('required')
        expect(page).to have_field('Title/Name of Screening', with: 'Little Shop Of Horrors')
        expect(page).to have_field('Assigned Social Worker', with: 'Bob Loblaw')
        expect(page).to have_field('Screening Start Date/Time', with: '08/13/2016 3:00 AM')
        expect(page).to have_field('Screening End Date/Time', with: '08/13/2016 4:00 AM')
        expect(page).to have_field('Communication Method', with: 'phone')
        expect(page).to have_content('Save')
        expect(page).to have_content('Cancel')
      end

      within '#narrative-card.edit', text: 'Narrative' do
        expect(page).to have_field('Report Narrative', with: 'Narrative 123 test')
        expect(page.find('label', text: 'Report Narrative')[:class]).to include('required')
      end

      within '#incident-information-card.edit', text: 'Incident Information' do
        expect(page).to have_field('Incident Date', with: '08/11/2016')
        expect(page).to have_field('Incident County', with: 'sacramento')
        expect(page).to have_field('Address', with: '123 Fake St')
        expect(page).to have_field('City', with: 'Faketown')
        expect(page).to have_field('State', with: 'DE')
        expect(page).to have_field('Zip', with: '20134')
        expect(page).to have_content('Save')
        expect(page).to have_content('Cancel')
      end

      within '.card.edit', text: 'Allegations' do
        expect(page).to have_css('th', text: 'Alleged Victim/Children')
        expect(page).to have_css('th', text: 'Alleged Perpetrator')
        expect(page).to have_css('th', text: 'Allegation(s)')
      end

      within '#worker-safety-card', text: 'Worker Safety' do
        has_react_select_field('Worker safety alerts', with: existing_screening.safety_alerts)
        expect(page).to have_field(
          'Additional safety information', with: existing_screening.safety_information
        )
        expect(page).to have_content('Save')
        expect(page).to have_content('Cancel')
        remove_react_select_option('Worker safety alerts', existing_screening.safety_alerts.first)
        expect(page).to have_no_content(existing_screening.safety_alerts.first)
      end

      expect(page).to have_css('#history-card.show', text: 'History')

      within '#decision-card.edit', text: 'Decision ' do
        expect(page.find('label', text: 'Screening Decision')[:class]).to include('required')
        expect(page).to have_field('Screening Decision', with: 'screen_out')
        expect(page).to have_select('Category', selected: 'Information request')
        expect(page).to have_field(
          'Additional information', with: 'This is why I decided what I did'
        )
      end

      within '#cross-report-card.edit', text: 'Cross Report' do
        expect(page).to have_content('This report has cross reported to:')
        expect(page.find('input[value="DISTRICT_ATTORNEY"]')).to be_checked
        expect(page).to have_select(
          'District attorney agency name',
          selected: 'LA District Attorney'
        )
        expect(page.find('input[value="LAW_ENFORCEMENT"]')).to be_checked
        expect(page).to have_select('Law enforcement agency name', selected: '')
        expect(page).to have_button 'Save'
        expect(page).to have_button 'Cancel'
      end
    end

    scenario 'aborting changes in Worker Saftey Card' do
      within '#worker-safety-card', text: 'Worker Safety' do
        fill_in_react_select(
          'Worker safety alerts', with: 'Hostile, Aggressive Client'
        )
        has_react_select_field(
          'Worker safety alerts',
          with: ['Dangerous Animal on Premises', 'Firearms in Home', 'Hostile, Aggressive Client']
        )
        click_button 'Cancel'
        expect(page).to have_content('Dangerous Animal on Premises')
        expect(page).to have_content('Firearms in Home')
        expect(page).to have_no_content('Hostile, Aggressive Client')
      end
    end

    scenario 'adding multiple alerts to existing ones in a Worker Safety Card' do
      within '#worker-safety-card', text: 'Worker Safety' do
        has_react_select_field(
          'Worker safety alerts',
          with: ['Dangerous Animal on Premises', 'Firearms in Home']
        )
        fill_in_react_select(
          'Worker safety alerts',
          with: 'Hostile, Aggressive Client'
        )
        fill_in_react_select(
          'Worker safety alerts',
          with: 'Severe Mental Health Status'
        )
        has_react_select_field(
          'Worker safety alerts',
          with: ['Dangerous Animal on Premises', 'Firearms in Home',
                 'Hostile, Aggressive Client', 'Severe Mental Health Status']
        )
        click_button 'Save'
      end
      pending('transition between save and show implemented')
      within '#worker-safety-card.show', text: 'Worker Safety' do
        expect(page).to have_content('Hostile, Aggressive Client')
        expect(page).to have_content('Dangerous Animal on Premises')
        expect(page).to have_content('Firearms in Home')
        expect(page).to have_content('Severe Mental Health Status')
      end
    end
  end

  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'edit an existing screening' do
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).and_return(json_body(existing_screening.to_json, status: 200))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)
      visit edit_screening_path(id: existing_screening.id)

      within '#snapshot-card' do
        expect(page).to have_content(
          'The Child Welfare History Snapshot allows you to search CWS/CMS for people'
        )
      end
      expect(page).to have_css('.card', text: 'Search')
      expect(page).to have_css('.card', text: 'History')

      expect(page).to_not have_css('.card', text: 'Screening Information')
      expect(page).to_not have_css('.card', text: 'Narrative')
      expect(page).to_not have_css('.card', text: 'Incident Information')
      expect(page).to_not have_css('.card', text: 'Allegations')
      expect(page).to_not have_css('.card', text: 'Relationships')
      expect(page).to_not have_css('.card', text: 'Worker Safety')
      expect(page).to_not have_css('.card', text: 'Cross Report')
      expect(page).to_not have_css('.card', text: 'Decision')

      expect(page).to have_content 'Start Over'
      click_button 'Start Over'
      expect(page.current_url).to have_content(root_path)
    end
  end
end

feature 'individual card save' do
  let(:address) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Faketown',
      state: 'DE',
      zip: '20134',
      type: nil
    )
  end
  let(:existing_screening) do
    FactoryGirl.create(
      :screening,
      address: address,
      assignee: 'Bob Loblaw',
      communication_method: 'phone',
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      name: 'Little Shop Of Horrors',
      safety_alerts: [],
      reference: 'My Bad!',
      report_narrative: 'Narrative 123 test',
      screening_decision: 'differential_response',
      screening_decision_detail: 'Text value',
      started_at: '2016-08-13T10:00:00.000Z'
    )
  end

  before(:each) do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
    visit edit_screening_path(id: existing_screening.id)
    within '#screening-information-card' do
      fill_in 'Title/Name of Screening', with: 'This should not save'
    end
  end

  scenario 'unchanged attributes are not blanked' do
    within '#incident-information-card', text: 'Incident Information' do
      updated_screening = as_json_without_root_id(
        existing_screening
      ).merge(incident_date: '1996-02-12')
      stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(updated_screening)))
        .and_return(json_body(updated_screening.to_json))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)
      fill_in_datepicker 'Incident Date', with: '02/12/1996'
      click_button 'Save'
      expect(
        a_request(
          :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
        ).with(json_body(as_json_without_root_id(updated_screening)))
      ).to have_been_made
    end
  end

  scenario 'narrative saves and cancels in isolation' do
    within '#narrative-card' do
      updated_screening = as_json_without_root_id(existing_screening).merge(
        report_narrative: 'This is the updated narrative'
      ).to_json
      stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(updated_screening))
        .and_return(json_body(updated_screening))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)

      fill_in 'Report Narrative', with: 'This is the updated narrative'
      click_button 'Save'
      expect(
        a_request(
          :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
        ).with(json_body(updated_screening))
      ).to have_been_made
    end
  end

  scenario 'cross report save and edits' do
    existing_screening.cross_reports = [
      {
        county_id: 'c41',
        agencies: [
          { id: '65Hvp7x01F', type: 'DISTRICT_ATTORNEY' }
        ]
      }
    ]

    stub_county_agencies('c41')
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    within '#cross-report-card' do
      select 'State of California', from: 'County'
      find('label', text: 'District attorney').click
      select 'LA District Attorney - Criminal Division', from: 'District attorney agency name'
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#cross-report-card' do
      click_link 'Edit cross report'
      expect(page).to have_select(
        'District attorney agency name',
        selected: 'LA District Attorney - Criminal Division'
      )
      select 'LA District Attorney', from: 'District attorney agency name'
      blur_field
      expect(page).to have_select(
        'District attorney agency name',
        selected: 'LA District Attorney'
      )
    end

    existing_screening.cross_reports = [
      {
        county_id: 'c41',
        agencies: [
          { id: '45Hvp7x00F', type: 'DISTRICT_ATTORNEY' }
        ]
      }
    ]

    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    within '#cross-report-card' do
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made
  end

  scenario 'Worker safety card saves in isolation' do
    existing_screening.safety_alerts = ['Dangerous Animal on Premises']
    existing_screening.safety_information = 'Important information!'
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    within '#worker-safety-card' do
      fill_in_react_select 'Worker safety alerts', with: 'Dangerous Animal on Premises'
      fill_in 'safety_information', with: 'Important information!'
      click_button 'Save'
    end
    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made
  end

  scenario 'Incident information saves and cancels in isolation' do
    within '#incident-information-card', text: 'Incident Information' do
      existing_screening.address.assign_attributes(
        street_address: '33 Whatever Rd',
        city: 'Modesto',
        state: 'TX',
        zip: '57575',
        type: nil
      )
      existing_screening.incident_date = '1996-02-12'

      stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
        .and_return(json_body(existing_screening.to_json))
      stub_empty_relationships_for_screening(existing_screening)
      stub_empty_history_for_screening(existing_screening)

      fill_in_datepicker 'Incident Date', with: '02-12-1996'
      fill_in 'Address', with: '33 Whatever Rd'
      fill_in 'City', with: 'Modesto'
      select 'Texas', from: 'State'
      fill_in 'Zip', with: '57575'
      click_button 'Save'

      expect(
        a_request(
          :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
        ).with(json_body(as_json_without_root_id(existing_screening)))
      ).to have_been_made
    end
  end
end
