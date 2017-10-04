# frozen_string_literal: true

require 'rails_helper'

feature 'Validate Investigation Contact' do
  before do
    investigation_id = '123ABC'
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigations_people_path(investigation_id))
    ).and_return(json_body([], status: 200))
    visit new_investigation_contact_path(investigation_id: investigation_id)

    # TODO: remove this once we can consistently have a fresh page for these specs
    page.driver.browser.navigate.refresh
  end

  scenario 'user sees that status is required' do
    expect(page).not_to have_content 'Please enter a contact status'

    select '', from: 'Status'
    blur_field
    expect(page).to have_content 'Please enter a contact status'

    select 'Attempted', from: 'Status'
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

  scenario 'user sees that purpose is required' do
    expect(page).not_to have_content 'Please enter a contact purpose'

    select '', from: 'Purpose'
    blur_field
    expect(page).to have_content 'Please enter a contact purpose'

    select 'Investigate Referral', from: 'Purpose'
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
end
