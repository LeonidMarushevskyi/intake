# frozen_string_literal: true
require 'rails_helper'

feature 'Create Person' do
  scenario 'via the create person link on the home page' do
    address = FactoryGirl.create(
      :address,
      city: 'Springfield',
      id: nil,
      state: 'NY',
      street_address: '123 fake st',
      zip: '12345'
    )
    person = FactoryGirl.create(
      :person,
      id: nil,
      date_of_birth: '05/29/1990',
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      address: address
    )

    faraday_helper do |stub|
      stub.post('/api/v1/people', person.to_json) do |_|
        [201, {}, person.as_json.merge(id: 1)]
      end
      stub.get('/api/v1/people/1') do |_|
        [200, {}, person.as_json.merge(id: 1)]
      end
    end

    visit root_path

    click_link 'Create Person'
    fill_in 'First Name', with: 'Homer'
    fill_in 'Last Name', with: 'Simpson'
    select 'Male', from: 'Gender'
    fill_in 'Date of birth', with: '05/29/1990'
    fill_in 'Social security number', with: '123-23-1234'
    fill_in 'Address', with: '123 fake st'
    fill_in 'City', with: 'Springfield'
    select 'New York', from: 'State'
    fill_in 'Zip', with: '12345'

    click_button 'Save'

    expect(page).to have_current_path(person_path(1))
    within '.card-header' do
      expect(page).to have_content('PROFILE INFORMATION')
    end
    expect(page).to_not have_content('Save')
  end
end
