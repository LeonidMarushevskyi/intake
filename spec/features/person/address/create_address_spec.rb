# frozen_string_literal: true
require 'rails_helper'

feature 'Create Address' do
  scenario 'add and remove address' do
    address = FactoryGirl.create(
      :address,
      city: 'Springfield',
      id: nil,
      state: 'NY',
      street_address: '123 fake st',
      zip: '12345',
      type: 'Placement'
    )
    person = FactoryGirl.create(
      :person,
      id: nil,
      phone_numbers: [],
      addresses: [address],
      languages: []
    )
    visit new_person_path

    click_button 'Add new address'
    within '#addresses' do
      fill_in 'Address', with: '123 fake st'
      fill_in 'City', with: 'Springfield'
      select 'New York', from: 'State'
      fill_in 'Zip', with: '12345'
      select 'Placement', from: 'Address Type'
    end

    click_button 'Add new address'
    within '#addresses' do
      within all('.list-item').last do
        fill_in 'Address', with: '123 capital Mall'
        fill_in 'City', with: 'Sacramento'
        select 'California', from: 'State'
        fill_in 'Zip', with: '12354'
        select 'Home', from: 'Address Type'
        click_link 'Delete address'
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
