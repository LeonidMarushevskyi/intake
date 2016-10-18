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
    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.post('/api/v1/people') do |_|
          [201, {}, person]
        end
        stub.get('/api/v1/people/1') do |_|
          [200, {}, person]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

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

    within '.card-header' do
      expect(page).to have_content('PROFILE INFORMATION')
    end
    expect(page).to_not have_content('Save')
  end
end
