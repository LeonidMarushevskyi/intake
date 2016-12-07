# frozen_string_literal: true
require 'rails_helper'

feature 'Create Phone Number' do
  scenario 'add and remove phone numbers on a new person' do
    person = FactoryGirl.create(
      :person,
      id: nil,
      phone_numbers: [{
        id: nil,
        number: '917-578-2010',
        type: 'Work',
        created_at: nil,
        updated_at: nil
      }],
      address: FactoryGirl.create(:address, id: nil)
    )
    visit new_person_path

    click_button 'Add new phone number'

    within '#phone-numbers' do
      fill_in 'Phone Number', with: '917-578-2010'
      select 'Work', from: 'Phone Number Type'
      expect(page).to have_link('Delete phone number')
    end

    click_button 'Add new phone number'

    within '#phone-numbers' do
      within all('.list-item').last do
        fill_in 'Phone Number', with: '789-578-2014'
        select 'Home', from: 'Phone Number Type'
        click_link 'Delete phone number'
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
