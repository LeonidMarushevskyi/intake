# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

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

  scenario 'edit an existing screening' do
    existing_screening = FactoryGirl.create(
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
      report_narrative: 'Narrative 123 test',
      screening_decision: 'screen_out',
      screening_decision_detail: 'information_request',
      started_at: '2016-08-13T10:00:00.000Z',
      cross_reports: [
        {
          agency_type: 'District attorney',
          agency_name: 'SCDA Office'
        },
        {
          agency_type: 'Law enforcement'
        }
      ]
    )

    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: existing_screening.id)
    expect(page).to have_content 'Edit Screening #My Bad!'

    within '#screening-information-card.edit', text: 'SCREENING INFORMATION' do
      expect(page).to have_field('Title/Name of Screening', with: 'Little Shop Of Horrors')
      expect(page).to have_field('Assigned Social Worker', with: 'Bob Loblaw')
      expect(page).to have_field('Screening Start Date/Time', with: '2016-08-13T10:00:00.000Z')
      expect(page).to have_field('Screening End Date/Time', with: '2016-08-13T11:00:00.000Z')
      expect(page).to have_field('Communication Method', with: 'phone')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
    end

    within '#narrative-card.edit', text: 'NARRATIVE' do
      expect(page).to have_field('Report Narrative', with: 'Narrative 123 test')
    end

    within '#incident-information-card.edit', text: 'INCIDENT INFORMATION' do
      expect(page).to have_field('Incident Date', with: '2016-08-11')
      expect(page).to have_field('Incident County', with: 'sacramento')
      expect(page).to have_field('Address', with: '123 Fake St')
      expect(page).to have_field('City', with: 'Faketown')
      expect(page).to have_field('State', with: 'DE')
      expect(page).to have_field('Zip', with: '20134')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
    end

    within '#allegations-card.edit', text: 'ALLEGATIONS' do
      expect(page).to have_css('th', text: 'Alleged Victim/Children')
      expect(page).to have_css('th', text: 'Alleged Perpetrator')
      expect(page).to have_css('th', text: 'Allegation(s)')
    end

    expect(page).to have_css('#worker-safety-card.edit', text: 'WORKER SAFETY')

    within '#history-card', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end

    within '#decision-card.edit', text: 'DECISION ' do
      expect(page).to have_field('Screening Decision', with: 'screen_out')
      expect(page).to have_select('Category', selected: 'Information request')
      expect(page).to have_field('Additional information', with: 'This is why I decided what I did')
    end

    within '#cross-report-card.edit', text: 'CROSS REPORT' do
      expect(page).to have_content('Cross reported to')
      expect(page.find('input[value="District attorney"]')).to be_checked
      expect(page).to have_field('District_attorney-agency-name', with: 'SCDA Office')
      expect(page.find('input[value="Law enforcement"]')).to be_checked
      expect(page).to have_field('Law_enforcement-agency-name', text: '')
      expect(page).to have_button 'Save'
      expect(page).to have_button 'Cancel'
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
      reference: 'My Bad!',
      report_narrative: 'Narrative 123 test',
      screening_decision: 'differential_response',
      screening_decision_detail: 'Text value',
      started_at: '2016-08-13T10:00:00.000Z'
    )
  end

  before(:each) do
    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_screening_path(id: existing_screening.id)
    within '#screening-information-card' do
      fill_in 'Title/Name of Screening', with: 'This should not save'
    end
  end

  scenario 'unchanged attributes are not blanked' do
    within '#incident-information-card', text: 'INCIDENT INFORMATION' do
      updated_screening = as_json_without_root_id(
        existing_screening
      ).merge(incident_date: '1996-02-12')
      stub_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(as_json_without_root_id(updated_screening)))
        .and_return(json_body(updated_screening.to_json))
      fill_in 'Incident Date', with: updated_screening[:incident_date]
      click_button 'Save'
      expect(
        a_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(as_json_without_root_id(updated_screening)))
      ).to have_been_made
    end
  end

  scenario 'narrative saves and cancels in isolation' do
    within '#narrative-card' do
      updated_screening = as_json_without_root_id(existing_screening).merge(
        report_narrative: 'This is the updated narrative'
      ).to_json
      stub_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening))
        .and_return(json_body(updated_screening))
      fill_in 'Report Narrative', with: 'This is the updated narrative'
      click_button 'Save'
      expect(
        a_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening))
      ).to have_been_made
    end
  end

  scenario 'cross report save and edits' do
    existing_screening.cross_reports = [
      {
        agency_type: 'Department of justice',
        agency_name: 'Sac Office'
      }
    ]

    stub_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))

    within '#cross-report-card' do
      find('label', text: 'Department of justice').click
      fill_in 'Department_of_justice-agency-name', with: 'Sac Office'
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#cross-report-card' do
      click_link 'Edit cross report'
      expect(page).to have_field('Department_of_justice-agency-name', with: 'Sac Office')

      doj_input = find_field('Department_of_justice-agency-name')
      10.times do
        doj_input.send_keys [:backspace]
      end
      expect(page).to have_field('Department_of_justice-agency-name', with: '')
    end

    existing_screening.cross_reports = [
      {
        agency_type: 'Department of justice',
        agency_name: nil
      }
    ]

    stub_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))

    within '#cross-report-card' do
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    page.driver.browser.navigate.refresh

    within '#cross-report-card' do
      find('label', text: 'Department of justice').click
      doj_input = find_field('Department_of_justice-agency-name')

      130.times do
        doj_input.send_keys ['a']
      end

      expect(doj_input.value.length).to equal(128)
    end
  end

  scenario 'Incident information saves and cancels in isolation' do
    within '#incident-information-card', text: 'INCIDENT INFORMATION' do
      existing_screening.incident_date = '1996-02-12'

      stub_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(as_json_without_root_id(existing_screening)))
        .and_return(json_body(existing_screening.to_json))

      fill_in 'Incident Date', with: '1996-02-12'
      click_button 'Save'

      expect(
        a_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(as_json_without_root_id(existing_screening)))
      ).to have_been_made
    end
  end

  scenario 'The user submits and clicks proceed' do
    click_button 'Submit'

    within '#submitModal' do
      expect(page).to have_content 'You have completed the process to submit a screening.'
      click_button 'Proceed'
      expect(page).to have_current_path('/screenings')
    end
  end

  scenario 'The user submits the screening and clicks cancel' do
    click_button 'Submit'

    within '#submitModal' do
      within '.modal-footer' do
        click_button 'Close'
      end
      expect(page).to have_current_path(edit_screening_path(id: existing_screening.id))
    end
  end
end
