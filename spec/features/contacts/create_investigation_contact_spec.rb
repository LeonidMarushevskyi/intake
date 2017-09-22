# frozen_string_literal: true

require 'rails_helper'

feature 'Create Investigation Contact' do
  scenario 'user can add new contact' do
    stub_system_codes
    visit new_investigation_contact_path(investigation_id: '123ABC')
    within '.card-header' do
      expect(page).to have_content('New Contact - Investigation 123ABC')
    end
    within '.card-body' do
      fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
      select 'Attempted', from: 'Status'
      select 'In person', from: 'Communication Method'
      select 'School', from: 'Location'
      select 'Investigate Referral', from: 'Purpose'
      fill_in 'Contact Notes', with: 'This was an attempted contact'
    end
    expect(page).to have_field('Date/Time', with: '08/17/2016 3:00 AM')
    expect(page).to have_select('Communication Method', selected: 'In person')
    expect(page).to have_select('Location', selected: 'School')
    expect(page).to have_select('Status', selected: 'Attempted')
    expect(page).to have_field('Contact Notes', with: 'This was an attempted contact')
    expect(page).to have_select('Purpose', selected: 'Investigate Referral')
  end

  scenario 'user does not see location until in person is selected for communication method' do
    stub_system_codes
    visit new_investigation_contact_path(investigation_id: '123ABC')

    expect(page).to_not have_select('Location')
    select 'In person', from: 'Communication Method'
    expect(page).to have_select('Location')
  end
end
