# frozen_string_literal: true
require 'rails_helper'

feature 'Create Person' do
  scenario 'via the create person link on the home page' do
    person = {
      id: 1,
      first_name: 'Homer',
      last_name: 'Simpson',
      gender: 'male',
      date_of_birth: '05/29/1990',
      ssn: '123-23-1234',
      address: {
        street_address: '123 fake st',
        city: 'Springfield',
        state: 'NY',
        zip: '12345'
      }
    }.with_indifferent_access
    stub_api_for(Person) do |stub|
      stub.post('/people') do |_env|
        [200, {}, person.to_json]
      end
      stub.get('/people/1') do |_env|
        [200, {}, person.to_json]
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

    expect(page).to have_content('Homer')
    expect(page).to have_content('Simpson')
    expect(page).to have_content('Male')
    expect(page).to have_content('05/29/1990')
    expect(page).to have_content('123-23-1234')
    expect(page).to have_content('123 fake st')
    expect(page).to have_content('Springfield')
    expect(page).to have_content('New York')
    expect(page).to have_content('12345')
    expect(page).to_not have_content('Save')
  end
end
