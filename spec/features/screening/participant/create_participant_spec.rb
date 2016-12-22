# frozen_string_literal: true
require 'rails_helper'
require 'spec_helper'

def build_participant_from_person_and_screening(person, screening)
  person.as_json(
    only: [
      :date_of_birth,
      :first_name,
      :gender,
      :last_name,
      :ssn
    ]
  ).merge(
    id: nil,
    person_id: person.id,
    screening_id: screening.id.to_s
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
  let(:marge) do
    Person.new(
      id: 99,
      date_of_birth: marge_date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      addresses: [marge_address]
    )
  end

  before do
    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    allow(PeopleRepo).to receive(:search).with(marge.first_name).and_return([marge])
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

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
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
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end

  scenario 'searching for a person with the participant autocompleter' do
    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
    end

    within 'li', text: 'Marge Simpson' do
      expect(page).to have_content marge_date_of_birth.strftime('%-m/%-d/%Y')
      expect(page).to have_content '15 yrs old'
      expect(page).to have_content 'Female'
      expect(page).to have_content 'SSN'
      expect(page).to have_content '123-23-1234'
      expect(page).to have_content 'Home'
      expect(page).to have_content '123 Fake St, Springfield, NY 12345'
    end
  end
end
