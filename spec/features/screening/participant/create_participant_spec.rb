# frozen_string_literal: true
require 'rails_helper'
require 'spec_helper'

def filtered_participant_attributes
  [
    :date_of_birth,
    :first_name,
    :gender,
    :last_name,
    :ssn
  ]
end

def build_participant_from_person_and_screening(person, screening)
  person.as_json(
    only: filtered_participant_attributes
  ).merge(
    id: nil,
    person_id: person.id,
    screening_id: screening.id.to_s,
    addresses: person.addresses
  )
end

feature 'Edit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:marge_date_of_birth) { 15.years.ago.to_date }
  let(:marge_address) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Springfield',
      state: 'NY',
      zip: '12345',
      type: 'Home'
    )
  end
  let(:marge_phone_number) do
    FactoryGirl.create(
      :phone_number,
      number: '971-287-6774',
      type: 'Home'
    )
  end
  let(:marge) do
    Person.new(
      id: '99',
      date_of_birth: marge_date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      languages: %w(French Italian),
      addresses: [marge_address],
      phone_numbers: [marge_phone_number],
      races: [
        { race: 'White', race_detail: 'European' },
        { race: 'American Indian or Alaska Native' }
      ],
      ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: 'Central American' }
    )
  end

  before do
    Timecop.travel(Time.parse('2016-12-28 17:01 PST').utc)
    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(:get, api_people_search_path(search_term: marge.first_name))
      .and_return(body: [marge].to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_screening_path(id: existing_screening.id)
  end

  scenario 'creating a new participant' do
    participant_marge = FactoryGirl.build(
      :participant,
      build_participant_from_person_and_screening(marge, existing_screening)
    )
    created_participant_marge = FactoryGirl.build(
      :participant,
      participant_marge.as_json.merge(id: 23)
    )
    stub_request(:post, api_participants_path)
      .with(body: participant_marge.to_json)
      .and_return(body: created_participant_marge.to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })

    fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

    within '#search-card', text: 'SEARCH' do
      fill_in_autocompleter 'Search for any person', with: 'Marge'
      find('li', text: 'Marge Simpson').click
    end

    expect(a_request(:post, api_participants_path)
      .with(body: participant_marge.to_json)).to have_been_made

    # adding participant doesnt change screening modifications
    expect(page).to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

    within edit_participant_card_selector(created_participant_marge.id) do
      within '.card-header' do
        expect(page).to have_content 'MARGE SIMPSON'
        expect(page).to have_link 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: marge.first_name)
        expect(page).to have_field('Last Name', with: marge.last_name)
        expect(page).to have_field('Gender', with: marge.gender)
        expect(page).to have_field('Date of birth', with: marge.date_of_birth)
        expect(page).to have_field('Social security number', with: marge.ssn)
        expect(page).to have_field('Address', with: marge.addresses.first.street_address)
        expect(page).to have_field('City', with: marge.addresses.first.city)
        expect(page).to have_field('State', with: marge.addresses.first.state)
        expect(page).to have_field('Zip', with: marge.addresses.first.zip)
        expect(page).to have_field('Address Type', with: marge.addresses.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end
end
