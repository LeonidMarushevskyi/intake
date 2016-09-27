# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Referral' do
  scenario 'edit an existing referral' do
    existing_referral = {
      id: 1,
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      name: 'Little Shop Of Horrors',
      narrative: 'Narrative 123 test',
      reference: 'My Bad!',
      response_time: 'immediate',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00:00.000Z',
      address: {
      },
      involved_people: [
        { id: 1, first_name: 'Homer', last_name: 'Simpson' }
      ]
    }.with_indifferent_access

    stub_api_for(Referral) do |stub|
      stub.get('/referrals/1') do |_env|
        [200, {}, existing_referral.to_json]
      end
    end

    visit edit_referral_path(id: existing_referral[:id])

    expect(page).to have_content 'Edit Referral #My Bad!'
    expect(page).to have_field('Title/Name of Referral', with: 'Little Shop Of Horrors')
    expect(page).to have_field('Phone Call Start Date/Time', with: '2016-08-13 10:00:00 UTC')
    expect(page).to have_field('Phone Call End Date/Time', with: '2016-08-13 11:00:00 UTC')
    expect(page).to have_field('Incident Date', with: '2016-08-11')
    expect(page).to have_field('Incident County', with: 'sacramento')
    expect(page).to have_field('Response Time', with: 'immediate')
    expect(page).to have_field('Screening Decision', with: 'evaluate_out')
    expect(page).to have_field('Narrative', with: 'Narrative 123 test')
    expect(page).to have_content 'Homer Simpson'

    search_results = [Person.new(first_name: 'Marge', last_name: 'Simpson')]
    allow(PeopleRepo).to receive(:search)
      .with('Marge')
      .and_return(search_results)

    fill_in 'Title/Name of Referral', with: 'The Rocky Horror Picture Show'
    select 'Mail', from: 'Method of Referral'
    fill_in 'Phone Call Start Date/Time', with: '2016-08-13 10:00 AM'
    fill_in 'Phone Call End Date/Time', with: '2016-08-22 11:00 AM'
    fill_in 'Incident Date', with: '2016-08-11'
    select  'Mariposa', from: 'Incident County'
    fill_in_autocompleter 'Involved People', with: 'Marge'
    within 'fieldset', text: 'Incident Address' do
      fill_in 'Address', with: '123 fake st'
      fill_in 'City', with: 'Springfield'
      select 'New York', from: 'State'
      fill_in 'Zip', with: '12345'
    end
    fill_in 'Narrative', with: 'Updated narrative'
    select "Child's Home", from: 'Location Type'

    updated_referral = {
      id: 1,
      reference: 'My Bad!',
      name: 'The Rocky Horror Picture Show',
      narrative: 'Updated narrative',
      involved_people: [
        { id: 1, first_name: 'Homer', last_name: 'Simpson' },
        { id: 2, first_name: 'Marge', last_name: 'Simpson' }
      ],
      address: {
      }
    }.with_indifferent_access

    stub_api_for(Referral) do |stub|
      stub.put('/referrals/1') do |_env|
        [200, {}, updated_referral.to_json]
      end
      stub.get('/referrals/1') do |_env|
        [200, {}, updated_referral.to_json]
      end
    end

    click_button 'Save'

    expect(page).to_not have_content 'Edit Referral'
    expect(page).to have_content 'Referral #My Bad!'
    expect(page).to have_content 'The Rocky Horror Picture Show'
    expect(page).to have_content 'Updated narrative'
    expect(page).to have_content 'Homer Simpson'
    expect(page).to have_content 'Marge Simpson'
  end
end
