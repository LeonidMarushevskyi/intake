# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  let(:new_ssn) { '123-23-1234' }
  let(:old_ssn) { '555-56-7895' }

  let(:address1) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Springfield',
      state: 'NY',
      zip: '12345',
      type: 'Home'
    )
  end
  let(:person1_attributes) do
    {
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: old_ssn,
      addresses: [address1]
    }
  end
  let(:person1) { Person.new(person1_attributes) }
  let(:participant1) do
    FactoryGirl.build(
      :participant,
      person1_attributes.merge(person_id: person1.id)
    )
  end

  let(:address2) do
    FactoryGirl.create(
      :address,
      street_address: '1234 Nowhere Ln',
      city: 'Springfield',
      state: 'IL',
      zip: '98675',
      type: 'Work'
    )
  end
  let(:person2_attributes) do
    {
      date_of_birth: 25.years.ago.to_date.to_s(:db),
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      ssn: '999-99-9999',
      addresses: [address2]
    }
  end
  let(:person2) { Person.new(person1_attributes) }
  let(:participant2) do
    FactoryGirl.build(
      :participant,
      person2_attributes.merge(person_id: person2.id)
    )
  end

  let(:screening) do
    FactoryGirl.build(
      :screening,
      participants: [participant1, participant2]
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

  scenario 'editing and saving a participant for a screening saves only the relevant participant' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(participant1.id) do
      within '.card-header' do
        expect(page).to have_content 'MARGE SIMPSON'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_selector("#address-#{address1.id}")
        expect(page).to have_field('First Name', with: person1.first_name)
        expect(page).to have_field('Last Name', with: person1.last_name)
        expect(page).to have_field('Gender', with: person1.gender)
        expect(page).to have_field('Date of birth', with: person1.date_of_birth)
        expect(page).to have_field('Social security number', with: person1.ssn)
        expect(page).to have_field('Address', with: person1.addresses.first.street_address)
        expect(page).to have_field('City', with: person1.addresses.first.city)
        expect(page).to have_field('State', with: person1.addresses.first.state)
        expect(page).to have_field('Zip', with: person1.addresses.first.zip)
        expect(page).to have_field('Address Type', with: person1.addresses.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'Social security number', with: new_ssn
        fill_in 'City', with: 'New City'
      end

      participant1.ssn = new_ssn
      participant1.addresses.first.city = 'New City'

      stub_request(:put, api_participant_path(participant1.id))
        .with(body: participant1.to_h.tap { |h| h.delete(:id) }.as_json)
        .and_return(status: 200,
                    body: participant1.to_json,
                    headers: { 'Content-Type' => 'application/json' })
    end

    within edit_participant_card_selector(participant2.id) do
      within '.card-body' do
        fill_in 'First Name', with: 'My new first name'
      end
    end

    within edit_participant_card_selector(participant1.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, api_participant_path(participant1.id))
        .with(json_body(participant1.to_h.tap { |h| h.delete(:id) }.as_json))
      ).to have_been_made
    end

    within show_participant_card_selector(participant1.id) do
      within '.card-body' do
        expect(page).to have_content(new_ssn)
        expect(page).to_not have_content(old_ssn)
        expect(page).to have_selector("#address-#{address1.id}")
        expect(page).to have_content('New City')
        expect(page).to_not have_content('Springfield')
      end
    end

    within edit_participant_card_selector(participant2.id) do
      within '.card-body' do
        expect(page).to have_field('First Name', with: 'My new first name')
      end
    end
  end

  scenario 'canceling edits for a screening participant' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(participant1.id) do
      within '.card-body' do
        expect(page).to have_field('Social security number', with: old_ssn)
        fill_in 'Social security number', with: new_ssn
        expect(page).to have_field('Social security number', with: new_ssn)
        click_button 'Cancel'
      end
    end

    expect(a_request(:put, api_participant_path(participant1.id))).to_not have_been_made

    within show_participant_card_selector(participant1.id) do
      within '.card-body' do
        expect(page).to have_content(old_ssn)
        expect(page).to_not have_content(new_ssn)
      end
    end
  end

  scenario 'when a user clicks cancel on edit page' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(participant1.id) do
      fill_in 'Social security number', with: new_ssn
      click_button 'Cancel'
    end

    expect(page).to have_content 'MARGE SIMPSON'
    expect(page).to have_link 'Edit participant'
    expect(page).to have_content old_ssn
  end
end
