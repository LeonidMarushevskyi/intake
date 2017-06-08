# frozen_string_literal: true

require 'rails_helper'

feature 'Create Address' do
  scenario 'add and remove address' do
    address1 = FactoryGirl.create(
      :address,
      city: 'Springfield',
      id: nil,
      state: 'NY',
      street_address: '123 fake st',
      zip: '55555',
      type: 'Placement'
    )
    address2 = FactoryGirl.create(
      :address,
      city: nil,
      id: nil,
      state: nil,
      street_address: nil,
      zip: '12455',
      type: nil
    )
    person = FactoryGirl.create(
      :person,
      phone_numbers: [],
      addresses: [address1, address2],
      languages: [],
      ethnicity: { hispanic_latino_origin: nil, ethnicity_detail: nil }
    )
    created_address1 = FactoryGirl.create(:address, address1.as_json.merge(id: '2'))
    created_address2 = FactoryGirl.create(:address, address2.as_json.merge(id: '3'))
    created_person = FactoryGirl.create(:person,
      person.as_json.merge(id: '1', addresses: [created_address1, created_address2]))

    visit new_person_path

    click_button 'Add new address'
    within '#addresses' do
      fill_in 'Address', with: '123 fake st'
      fill_in 'City', with: 'Springfield'
      select 'New York', from: 'State'
      fill_in 'Zip', with: '55555'
      select 'Placement', from: 'Address Type'
    end

    click_button 'Add new address'
    within '#addresses' do
      within all('.list-item').last do
        fill_in 'Address', with: nil
        fill_in 'City', with: nil
        select '', from: 'State'
        fill_in 'Zip', with: '12455'
        select '', from: 'Address Type'
      end
    end

    stub_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id))
      .and_return(body: created_person.to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(created_person.id)))
      .and_return(body: created_person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    click_button 'Save'

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id)))
      .to have_been_made

    expect(page).to have_current_path(person_path(1))
  end

  scenario 'create a person with empty address ' do
    person = FactoryGirl.create(
      :person,
      id: nil,
      phone_numbers: [],
      addresses: [],
      languages: [],
      ethnicity: { hispanic_latino_origin: nil, ethnicity_detail: nil }
    )
    created_person = FactoryGirl.create(:person, person.as_json.merge(id: '1'))
    stub_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id))
      .and_return(body: created_person.to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(created_person.id)))
      .and_return(body: created_person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit new_person_path
    click_button 'Add new address'

    click_button 'Save'

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_people_path))
      .with(body: person.to_json(except: :id)))
      .to have_been_made
  end
end
