# frozen_string_literal: true

require 'rails_helper'

feature 'Validate Investigation Contact' do
  scenario 'user sees that date/time is required' do
    investigation_id = '123ABC'
    visit new_investigation_contact_path(investigation_id: investigation_id)

    expect(page).not_to have_content 'The date and time cannot be in the future.'
    expect(page).not_to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: '', blur: false
    expect(page).not_to have_content 'Please enter a contact date'
    blur_field
    expect(page).to have_content 'Please enter a contact date'

    fill_in_datepicker 'Date/Time', with: 2.years.from_now
    expect(page).to have_content 'The date and time cannot be in the future.'

    fill_in_datepicker 'Date/Time', with: 2.years.ago
    expect(page).not_to have_content 'The date and time cannot be in the future.'
    expect(page).not_to have_content 'Please enter a contact date'
  end
end
