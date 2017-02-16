# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  address = FactoryGirl.create(
    :address,
    street_address: '123 Fake St',
    city: 'Springfield',
    state: 'NY',
    zip: '12345',
    type: 'Home'
  )
  let(:person_attributes) do
    {
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      addresses: [address]
    }
  end
  let(:person) { Person.new(person_attributes) }
  let(:participant) do
    FactoryGirl.build(
      :participant,
      person_attributes.merge(person_id: person.id)
    )
  end
  let(:screening) do
    FactoryGirl.build(
      :screening,
      participants: [participant]
    )
  end

  before do
    stub_request(:get, api_screening_path(screening.id))
      .and_return(
        body: screening.to_json,
        status: 200,
        headers: { 'Content-Type' => 'application/json' }
      )
  end

  scenario 'editing a screening with a participant' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(participant.id) do
      within '.card-header' do
        expect(page).to have_content 'MARGE SIMPSON'
        expect(page).to have_link 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: person.first_name)
        expect(page).to have_field('Last Name', with: person.last_name)
        expect(page).to have_field('Gender', with: person.gender)
        expect(page).to have_field('Date of birth', with: person.date_of_birth)
        expect(page).to have_field('Social security number', with: person.ssn)
        expect(page).to have_field('Address', with: person.addresses.first.street_address)
        expect(page).to have_field('City', with: person.addresses.first.city)
        expect(page).to have_field('State', with: person.addresses.first.state)
        expect(page).to have_field('Zip', with: person.addresses.first.zip)
        expect(page).to have_field('Address Type', with: person.addresses.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end

  scenario 'when a user clicks cancel on edit page' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(participant.id) do
      click_button 'Cancel'
    end

    expect(page).to have_content 'MARGE SIMPSON'
    expect(page).to have_link 'Edit participant'
  end
end
