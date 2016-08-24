# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Referral' do
  scenario 'edit an existing referral' do
    existing_referral = {
      id: 1,
      reference: 'My Bad!',
      name: 'Little Shop Of Horrors',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-13T11:00:00.000Z',
      incident_date: '2016-08-11',
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

    fill_in 'Title/Name of Referral', with: 'The Rocky Horror Picture Show'
    select 'Mail', from: 'Method of Referral'
    fill_in 'Phone Call Start Date/Time', with: '2016-08-13 10:00 AM'
    fill_in 'Phone Call End Date/Time', with: '2016-08-22 11:00 AM'
    fill_in 'Incident Date', with: '2016-08-11'
    within 'fieldset', text: 'Incident Address' do
      fill_in 'Address', with: '123 fake st'
      fill_in 'City', with: 'Springfield'
      select 'New York', from: 'State'
      fill_in 'Zip', with: '12345'
    end
    select "Child's Home", from: 'Location Type'

    updated_referral = {
      id: 1,
      reference: 'My Bad!',
      name: 'The Rocky Horror Picture Show',
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
  end
end
