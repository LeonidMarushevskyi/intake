# frozen_string_literal: true

require 'rails_helper'

feature 'Show Person' do
  scenario 'display phone numbers ' do
    person = FactoryGirl.create(
      :person,
      phone_numbers: [
        {
          id: '1',
          number: '917-578-2010',
          type: 'Work'
        },
        {
          id: '2',
          number: '456-789-4566',
          type: nil
        }
      ],
      addresses: FactoryGirl.create(:address, id: nil)
    )
    stub_request(:get, intake_api_person_url(person.id))
      .and_return(body: person.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit person_path(id: person.id)

    expect(page).to have_content('917-578-2010')
    expect(page).to have_content('Work')
    expect(page).to have_content('456-789-4566')
  end
end
