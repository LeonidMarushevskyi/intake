# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  let(:existing_screening) do
    {
      id: 99,
      created_at: '2016-10-24T15:14:22.923Z',
      ended_at: nil,
      incident_county: nil,
      incident_date: nil,
      location_type: nil,
      communication_method: nil,
      name: nil,
      report_narrative: nil,
      reference: '8KXNCK',
      response_time: nil,
      screening_decision: nil,
      started_at: nil,
      address: {
        street_address: nil,
        state: nil,
        city: nil,
        zip: nil,
        id: 8
      },
      participants: []
    }.with_indifferent_access
  end
  let(:marge_date_of_birth) { 15.years.ago.to_date }
  let(:marge_attributes) do
    {
      id: 99,
      first_name: 'Marge',
      last_name: 'Simpson',
      date_of_birth: marge_date_of_birth.to_s(:db),
      gender: 'female',
      ssn: '123-23-1234'
    }
  end
  let(:marge) { Person.new(marge_attributes) }

  before do
    faraday_helper do |stub|
      stub.get("/api/v1/screenings/#{existing_screening[:id]}") do |_|
        [200, {}, existing_screening]
      end
    end
    allow(PeopleRepo).to receive(:search).with(marge.first_name).and_return([marge])
  end

  scenario 'creating a new participant' do
    visit edit_screening_path(id: existing_screening[:id])

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
      find('li', text: 'Marge Simpson').click
    end

    within "#participants-card-#{marge.id}.edit" do
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
    visit edit_screening_path(id: existing_screening[:id])

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
    end

    within 'li', text: 'Marge Simpson' do
      expect(page).to have_content marge_date_of_birth.strftime('%-m/%-d/%Y')
      expect(page).to have_content '15 yrs old'
      expect(page).to have_content 'Female'
    end
  end
end
