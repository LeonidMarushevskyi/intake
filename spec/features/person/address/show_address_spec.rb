# frozen_string_literal: true

require 'rails_helper'

feature 'Show Person' do
  scenario 'display addresses' do
    address1 = FactoryGirl.create(
      :address,
      city: 'Springfield',
      id: '1',
      state: 'NY',
      street_address: '123 fake st',
      zip: '12345',
      type: 'Placement'
    )
    address2 = FactoryGirl.create(
      :address,
      city: 'Sacramento',
      id: '2',
      state: 'CA',
      street_address: '123 capital Mall',
      zip: '12354',
      type: 'Home'
    )
    person = FactoryGirl.create(
      :person,
      phone_numbers: [],
      addresses: [address1, address2],
      languages: []
    )
    stub_request(:get, host_url(ExternalRoutes.intake_api_person_path(person.id)))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit person_path(id: person.id)

    expect(page).to have_content('123 fake st')
    expect(page).to have_content('Springfield')
    expect(page).to have_content('New York')
    expect(page).to have_content('12345')
    expect(page).to have_content('Placement')
    expect(page).to have_content('123 capital Mall')
    expect(page).to have_content('Sacramento')
    expect(page).to have_content('California')
    expect(page).to have_content('12354')
    expect(page).to have_content('Home')
    expect(page).to_not have_content('Save')
    expect(page).to have_link('Edit Person', href: edit_person_path(id: person.id))
  end
end
