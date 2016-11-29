# frozen_string_literal: true
require 'rails_helper'

feature 'Show Person' do
  scenario 'display phone numbers ' do
    person = FactoryGirl.create(
      :person,
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
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit person_path(id: person.id)

    expect(page).to have_content('917-578-2010')
    expect(page).to have_content('Work')
  end
end

