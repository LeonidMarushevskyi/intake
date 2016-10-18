# frozen_string_literal: true
require 'rails_helper'

feature 'Edit Person' do
  scenario 'edit and existing person' do
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
        stub.get('/api/v1/people/1') do |_|
          [200, {}, person]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

    visit edit_person_path(id: person[:id])

    within '.card-header' do
      expect(page).to have_content 'EDIT PERSON'
    end

    within '.card-body' do
      expect(page).to have_field('First Name', with: 'Homer')
      expect(page).to have_field('Last Name', with: 'Simpson')
      expect(page).to have_field('Gender', with: 'male')
      expect(page).to have_field('Date of birth', with: '05/29/1990')
      expect(page).to have_field('Social security number', with: '123-23-1234')
      expect(page).to have_field('Address', with: '123 fake st')
      expect(page).to have_field('City', with: 'Springfield')
      expect(page).to have_field('State', with: 'NY')
      expect(page).to have_field('Zip', with: '12345')
    end
    expect(page).to have_button 'Cancel'
    expect(page).to have_button 'Save'
  end
end
