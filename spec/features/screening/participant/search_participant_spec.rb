# frozen_string_literal: true
require 'rails_helper'
require 'spec_helper'
feature 'searching a participant in autocompleter' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:date_of_birth) { 15.years.ago.to_date }
  let(:address) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Springfield',
      state: 'NY',
      zip: '12345',
      type: 'Work'
    )
  end
  let(:phone_number) do
    FactoryGirl.create(
      :phone_number,
      number: '971-287-6774',
      type: 'Home'
    )
  end
  let(:person) do
    Person.new(
      id: '99',
      date_of_birth: date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      addresses: [address],
      phone_numbers: [phone_number]
    )
  end
  before do
    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'searching for a person' do
    scenario 'person without phone_numbers' do
      person_with_out_phone_numbers = person.as_json.except('phone_numbers')

      stub_request(:get, api_people_search_path(search_term: person.first_name))
        .and_return(body: [person_with_out_phone_numbers].to_json,
                    status: 200,
                    headers: { 'Content-Type' => 'application/json' })

      within '#search-card', text: 'SEARCH' do
        fill_in_autocompleter 'Search for any person', with: 'Marge'
      end

      expect(person_with_out_phone_numbers.key?('phone_numbers')).to be false

      within 'li' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Work'
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to_not have_content '971-287-6774'
        expect(page).to_not have_content 'Home'
      end
    end

    scenario 'person without addresses' do
      person_with_out_addresses = person.as_json.except('addresses')

      stub_request(:get, api_people_search_path(search_term: person.ssn))
        .and_return(body: [person_with_out_addresses].to_json,
                    status: 200,
                    headers: { 'Content-Type' => 'application/json' })

      within '#search-card', text: 'SEARCH' do
        fill_in_autocompleter 'Search for any person',
          with: person.ssn, result_should_contain: 'Marge'
      end

      expect(person_with_out_addresses.key?('addresses')).to be false

      within 'li' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '123-23-1234'
        expect(page).to_not have_content 'Work'
        expect(page).to_not have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to_not have_content '971-287-6774'
        expect(page).to_not have_content 'Home'
      end
    end
    scenario 'person with name only' do
      person_with_name_only = person.as_json.extract!('first_name', 'last_name')
      stub_request(:get, api_people_search_path(search_term: person.first_name))
        .and_return(body: [person_with_name_only].to_json,
                    status: 200,
                    headers: { 'Content-Type' => 'application/json' })

      within '#search-card', text: 'SEARCH' do
        fill_in_autocompleter 'Search for any person', with: person.first_name
      end

      within 'li' do
        expect(page).to have_content 'Marge Simpson'
        expect(page).to_not have_content '15 yrs old'
        expect(page).to_not have_content '123-23-1234'
      end
    end
  end
end
