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
      address: address,
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
      started_at: '2016-08-13T10:00:00.000Z',
      decision_rationale: 'This is why I decided what I did'
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
      expect(page).to have_field('Response Time', with: 'immediate')
      expect(page).to have_field('Screening Decision', with: 'evaluate_out')
      expect(page).to have_field('Decision Rationale', with: 'This is why I decided what I did')
    end

    expect(page).to have_css('#cross-report-card.edit', text: 'CROSS REPORT')
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
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
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
      updated_screening = existing_screening.as_json(except: :id).merge(incident_date: '1996-02-12')
      stub_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening.to_json(except: :id)))
        .and_return(json_body(updated_screening.to_json))
      fill_in 'Incident Date', with: updated_screening[:incident_date]
      click_button 'Save'
      expect(
        a_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening.to_json(except: :id)))
      ).to have_been_made
    end
  end

  scenario 'narrative saves and cancels in isolation' do
    within '#narrative-card' do
      updated_screening = existing_screening.as_json(except: :id).merge(
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

  scenario 'Incident information saves and cancels in isolation' do
    change_address = FactoryGirl.create(
      :address,
      street_address: '33 Whatever Rd',
      city: 'Modesto',
      state: 'TX',
      zip: '57575',
      type: nil
    )
    within '#incident-information-card', text: 'INCIDENT INFORMATION' do
      updated_screening = existing_screening.as_json(except: :id).merge(address: change_address,
                                                                        incident_date: '1996-02-12')
      stub_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening.to_json(except: :id)))
        .and_return(json_body(updated_screening.to_json))
      fill_in 'Incident Date', with: updated_screening[:incident_date]
      fill_in 'Address', with: change_address.street_address
      fill_in 'City', with: change_address.city
      select 'Texas', from: 'State'
      fill_in 'Zip', with: change_address.zip
      click_button 'Save'

      expect(
        a_request(:put, api_screening_path(existing_screening.id))
        .with(json_body(updated_screening.to_json(except: :id)))
      ).to have_been_made
    end
  end
end
