# frozen_string_literal: true
require 'rails_helper'

feature 'Edit Phone Number' do
  scenario 'edit an existing persons phone number' do
    person = FactoryGirl.create(
      :person,
      id: 1,
      phone_numbers: [{
        id: 1,
        phone_number: '917-578-2010',
        phone_number_type: 'work',
        created_at: '2016-08-11T18:24:22.157Z',
        updated_at: '2016-08-11T18:24:22.157Z',
      }],
      address: FactoryGirl.create(:address, id: nil)
    )

    stub_request(:get, api_person_path(person.id))
      .and_return(body: person.to_json, status: 200, headers: { 'Content-Type' => 'application/json' })
    visit edit_person_path(id: person.id)

    within '#added_phone_numbers' do
      expect(page).to have_field('Phone Number', with: '917-578-2010')
      expect(page).to have_field('Phone Number Type', with: 'work')

      fill_in 'Phone Number', with: '917-578-1234'
      select 'Home', from: 'Phone Number Type'
    end

    click_button 'Save'

    person.phone_numbers.first.phone_number = '917-578-1234'
    person.phone_numbers.first.phone_number_type = 'home'
    expect(a_request(:put, api_person_path(person.id))
      .with(body: person.to_json)).to have_been_made
  end
end

