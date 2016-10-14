# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  scenario 'edit an existing referral' do
    existing_referral = {
      id: 1,
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      communication_method: 'phone',
      name: 'Little Shop Of Horrors',
      narrative: 'Narrative 123 test',
      reference: 'My Bad!',
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00:00.000Z',
      address: {
      },
      participants: [
        { id: 1, first_name: 'Homer', last_name: 'Simpson' }
      ]
    }.with_indifferent_access

    stub_api_for(Screening) do |stub|
      stub.get('/screenings/1') do |_env|
        [200, {}, existing_referral.to_json]
      end
    end

    visit edit_screening_path(id: existing_referral[:id])
    expect(page).to have_content 'Edit Screening #My Bad!'

    within '#screening-information-card' do
      expect(page).to have_field('Title/Name of Screening', with: 'Little Shop Of Horrors')
      expect(page).to have_field('Screening Start Date/Time', with: '2016-08-13 10:00:00 UTC')
      expect(page).to have_field('Screening End Date/Time', with: '2016-08-13 11:00:00 UTC')
      expect(page).to have_field('Communication Method', with: 'phone')
    end

    within '#participants-card' do
      expect(page).to have_content 'Homer Simpson'
    end

    within '#referral-information-card' do
      expect(page).to have_field('Incident Date', with: '2016-08-11')
      expect(page).to have_field('Incident County', with: 'sacramento')
      expect(page).to have_field('Response Time', with: 'immediate')
      expect(page).to have_field('Screening Decision', with: 'evaluate_out')
      expect(page).to have_field('Narrative', with: 'Narrative 123 test')
    end

    search_results = [Person.new(first_name: 'Marge', last_name: 'Simpson')]
    allow(PeopleRepo).to receive(:search)
      .with('Marge')
      .and_return(search_results)

    within '#screening-information-card' do
      fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'
      fill_in 'Screening Start Date/Time', with: '2016-08-13 10:00 AM'
      fill_in 'Screening End Date/Time', with: '2016-08-22 11:00 AM'
      select  'Mail', from: 'Communication Method'
    end

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
    end

    within '#referral-information-card' do
      fill_in 'Incident Date', with: '2016-08-11'
      select  'Mariposa', from: 'Incident County'
      within 'fieldset', text: 'Incident Address' do
        fill_in 'Address', with: '123 fake st'
        fill_in 'City', with: 'Springfield'
        select 'New York', from: 'State'
        fill_in 'Zip', with: '12345'
      end
      fill_in 'Narrative', with: 'Updated narrative'
      select "Child's Home", from: 'Location Type'
    end

    updated_referral = {
      id: 1,
      reference: 'My Bad!',
      name: 'The Rocky Horror Picture Show',
      narrative: 'Updated narrative',
      communication_method: 'mail',
      participants: [
        { id: 1, first_name: 'Homer', last_name: 'Simpson' },
        { id: 2, first_name: 'Marge', last_name: 'Simpson' }
      ],
      address: {
      }
    }.with_indifferent_access

    stub_api_for(Screening) do |stub|
      stub.put('/screenings/1') do |_env|
        [200, {}, updated_referral.to_json]
      end
      stub.get('/screenings/1') do |_env|
        [200, {}, updated_referral.to_json]
      end
    end

    click_button 'Save'

    expect(page).to_not have_content 'Edit Screening'
    expect(page).to have_content 'Screening #My Bad!'
    expect(page).to have_content 'The Rocky Horror Picture Show'
    expect(page).to have_content 'Updated narrative'
    expect(page).to have_content 'Mail'
    expect(page).to have_content 'Homer Simpson'
    expect(page).to have_content 'Marge Simpson'
  end
end
