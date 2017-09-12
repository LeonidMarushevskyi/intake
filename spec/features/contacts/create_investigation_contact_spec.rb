# frozen_string_literal: true

require 'rails_helper'

feature 'Create Investigation Contact' do
  scenario 'user can add new contact' do
    investigation_id = '123ABC'
    visit new_investigation_contact_path(investigation_id: investigation_id)
    within '.card-header' do
      expect(page).to have_content("New Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
      select 'Attempted', from: 'Status'
    end
    expect(page).to have_field('Date/Time', with: '08/17/2016 3:00 AM')
    expect(page).to have_select('Status', selected: 'Attempted')
  end
end
