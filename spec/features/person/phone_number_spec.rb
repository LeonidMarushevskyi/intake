# frozen_string_literal: true
require 'rails_helper'

feature 'Create Person' do
  scenario 'add and remove phone numbers' do
    person = FactoryGirl.create(
      :person,
      id: nil,
      phone_numbers: [{
        id: nil,
        phone_number: '917-578-2010',
        phone_number_type: 'work',
        created_at: nil,
        updated_at: nil,
      }],
      address: FactoryGirl.create(:address, id: nil)
    )
    visit new_person_path

    within '#new_phone_number' do
      fill_in 'Phone Number', with: '917-578-2010'
      select 'Work', from: 'Phone Number Type'
      click_button 'Add'
    end

    expect(all('.bg-gray-lightest').size).to eq 2
    within '#added_phone_numbers' do
      expect(page).to have_field('Phone Number', with: '917-578-2010')
      expect(page).to have_field('Phone Number Type', with: 'work')
      expect(page).to have_button('Delete')
    end

    within '#new_phone_number' do
      fill_in 'Phone Number', with: '789-578-2014'
      select 'Home', from: 'Phone Number Type'
      click_button 'Add'
    end

    expect(all('.bg-gray-lightest').size).to eq 3
    within '#added_phone_numbers' do
      within all('.bg-gray-lightest').last do
        expect(page).to have_field('Phone Number', with: '789-578-2014')
        expect(page).to have_field('Phone Number Type', with: 'home')
        click_button 'Delete'
      end
    end

    stub_request(:post, api_people_path)
      .with(body: person.to_json)
      .and_return(body: person.as_json.merge(id: 1).to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, api_person_path(1))
      .and_return(body: person.as_json.merge(id: 1).to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'

    expect(a_request(:post, api_people_path)
      .with(body: person.to_json))
      .to have_been_made

    expect(page).to have_current_path(person_path(1))
  end
end
