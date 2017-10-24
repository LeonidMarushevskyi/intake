# frozen_string_literal: true

require 'rails_helper'

feature 'Validate Investigation Contact' do
  let(:investigation_started_at) { Time.parse('2017-08-15T14:00:00.000') }
  let(:people) do
    [
      {
        first_name: 'Emma',
        last_name: 'Woodhouse',
        legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' }
      }, {
        first_name: 'George',
        last_name: 'Knightley',
        legacy_descriptor: { legacy_id: '2', legacy_table_name: 'foo' }
      }
    ]
  end
  before do
    investigation_id = '123ABC'
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
    ).and_return(
      json_body(
        {
          started_at: investigation_started_at.strftime('%Y-%m-%dT%H:%M:%S.%L'),
          people: people
        }.to_json,
        status: 200
      )
    )
    visit new_investigation_contact_path(investigation_id: investigation_id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.driver.browser.navigate.refresh
  end

  scenario 'user sees that status is required' do
    expect(page).not_to have_content 'Please enter a contact status'

    select '', from: 'Status'
    blur_field
    expect(page).to have_content 'Please enter a contact status'

    select 'Contact status 1', from: 'Status'
    expect(page).not_to have_content 'Please enter a contact status'
  end

  scenario 'user sees that date/time is required' do
    expect(page).not_to have_content 'The date and time cannot be in the future'
    expect(page).not_to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: '', blur: false
    expect(page).not_to have_content 'Please enter a contact date'
    blur_field
    expect(page).to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: 2.years.from_now
    expect(page).to have_content 'The date and time cannot be in the future'

    fill_in_datepicker 'Date/Time', with: 2.years.ago
    expect(page).not_to have_content 'The date and time cannot be in the future'
    expect(page).not_to have_content 'Please enter a contact date'
  end

  scenario 'user sees that date/time cannot be before investigation started at' do
    expect(page).not_to have_content(
      'The contact date/time must be after the investigation start date of'
    )

    fill_in_datepicker 'Date/Time', with: (investigation_started_at - 1.day)
    formatted_date = investigation_started_at.strftime('%m/%d/%Y %l:%M %p')
    expect(page).to have_content(
      "The contact date/time must be after the investigation start date of #{formatted_date}"
    )

    fill_in_datepicker 'Date/Time', with: investigation_started_at
    expect(page).to_not have_content(
      'The contact date/time must be after the investigation start date of'
    )
  end

  scenario 'user sees that purpose is required' do
    expect(page).not_to have_content 'Please enter a contact purpose'

    select '', from: 'Purpose'
    blur_field
    expect(page).to have_content 'Please enter a contact purpose'

    select 'Contact purpose 1', from: 'Purpose'
    expect(page).not_to have_content 'Please enter a contact purpose'
  end

  scenario 'user sees that communication method is required' do
    expect(page).not_to have_content 'Please enter the communication method'

    select '', from: 'Communication Method'
    blur_field
    expect(page).to have_content 'Please enter the communication method'

    select 'In person', from: 'Communication Method'
    expect(page).not_to have_content 'Please enter the communication method'
  end

  scenario 'user sees that location is required' do
    expect(page).not_to have_content 'Please enter the contact location'

    select 'In person', from: 'Communication Method'
    select '', from: 'Location'
    blur_field
    expect(page).to have_content 'Please enter the contact location'

    select 'School', from: 'Location'
    expect(page).not_to have_content 'Please enter the contact location'
  end

  scenario 'user sees all validations after clicking save' do
    expect(page).to_not have_content 'Please enter a contact status'
    expect(page).to_not have_content 'Please enter a contact date'
    expect(page).to_not have_content 'Please enter a contact purpose'
    expect(page).to_not have_content 'Please enter the communication method'
    expect(page).to_not have_content 'At least one person must be present for a contact'

    click_on 'Save'

    expect(page).to have_content 'Please enter a contact status'
    expect(page).to have_content 'Please enter a contact date'
    expect(page).to have_content 'Please enter a contact purpose'
    expect(page).to have_content 'Please enter the communication method'
    expect(page).to have_content 'At least one person must be present for a contact'

    select 'Contact status 2', from: 'Status'
    fill_in_datepicker 'Date/Time', with: 2.years.from_now
    select 'Contact purpose 1', from: 'Purpose'
    select 'In person', from: 'Communication Method'
    select 'School', from: 'Location'
    find('label', text: 'Emma Woodhouse').click

    click_on 'Save'

    expect(page).to_not have_content 'Please enter a contact status'
    expect(page).to_not have_content 'Please enter a contact date'
    expect(page).to_not have_content 'Please enter a contact purpose'
    expect(page).to_not have_content 'Please enter the communication method'
    expect(page).to_not have_content 'At least one person must be present for a contact'
  end
end
