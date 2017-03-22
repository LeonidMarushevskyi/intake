# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  let(:new_ssn) { '123-23-1234' }
  let(:old_ssn) { '555-56-7895' }

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
  let(:marge_roles) { %w(Victim Perpetrator) }
  let(:marge) do
    FactoryGirl.create(
      :participant,
      person_id: 1,
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: old_ssn,
      addresses: [marge_address],
      roles: marge_roles
    )
  end

  let(:homer_address) do
    FactoryGirl.create(
      :address,
      street_address: '1234 Nowhere Ln',
      city: 'Springfield',
      state: 'IL',
      zip: '98675',
      type: 'Work'
    )
  end
  let(:homer) do
    FactoryGirl.create(
      :participant,
      person_id: 2,
      date_of_birth: 25.years.ago.to_date.to_s(:db),
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      ssn: old_ssn,
      addresses: [homer_address],
      roles: ['Reporter']
    )
  end

  let(:screening) do
    FactoryGirl.build(
      :screening,
      participants: [marge, homer]
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

    within edit_participant_card_selector(marge.id) do
      within '.card-header' do
        expect(page).to have_content 'MARGE SIMPSON'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_selector("#address-#{marge_address.id}")
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
        fill_in 'Social security number', with: new_ssn
        fill_in 'City', with: 'New City'
      end

      marge.ssn = new_ssn
      marge.addresses.first.city = 'New City'

      stub_request(:put, api_participant_path(marge.id))
        .with(body: remove_root_id(marge.as_json))
        .and_return(status: 200,
                    body: marge.to_json,
                    headers: { 'Content-Type' => 'application/json' })
    end

    within edit_participant_card_selector(homer.id) do
      within '.card-body' do
        fill_in 'First Name', with: 'My new first name'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, api_participant_path(marge.id))
        .with(json_body(remove_root_id(marge.as_json)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_content(new_ssn)
        expect(page).to_not have_content(old_ssn)
        expect(page).to have_selector("#address-#{marge_address.id}")
        expect(page).to have_content('New City')
        expect(page).to_not have_content('Springfield')
      end
    end

    within edit_participant_card_selector(homer.id) do
      within '.card-body' do
        expect(page).to have_field('First Name', with: 'My new first name')
      end
    end
  end

  scenario 'editing and then removing an address from a participant' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#address-#{marge_address.id}")
        expect(page).to have_field('Address', with: marge.addresses.first.street_address)
        expect(page).to have_field('City', with: marge.addresses.first.city)
        expect(page).to have_field('State', with: marge.addresses.first.state)
        expect(page).to have_field('Zip', with: marge.addresses.first.zip)
        expect(page).to have_field('Address Type', with: marge.addresses.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'City', with: 'New City'
      end

      marge.addresses.first.city = 'New City'

      stub_request(:put, api_participant_path(marge.id))
        .with(body: remove_root_id(marge.as_json))
        .and_return(status: 200,
                    body: marge.to_json,
                    headers: { 'Content-Type' => 'application/json' })
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, api_participant_path(marge.id))
        .with(json_body(remove_root_id(marge.as_json)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#address-#{marge_address.id}")
        expect(page).to have_content('New City')
        expect(page).to_not have_content('Springfield')
      end

      within '.card-header' do
        click_link 'Edit participant'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        within "#address-#{marge_address.id}" do
          click_link 'Delete address'
        end

        expect(page).to_not have_selector("#address-#{marge_address.id}")
      end
    end

    marge.addresses = []

    stub_request(:put, api_participant_path(marge.id))
      .with(body: remove_root_id(marge.as_json))
      .and_return(status: 200,
                  body: marge.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, api_participant_path(marge.id))
        .with(json_body(remove_root_id(marge.as_json)))
      ).to have_been_made
    end
  end

  scenario 'canceling edits for a screening participant' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_field('Social security number', with: old_ssn)
        fill_in 'Social security number', with: new_ssn
        expect(page).to have_field('Social security number', with: new_ssn)
        click_button 'Cancel'
      end
    end

    expect(a_request(:put, api_participant_path(marge.id))).to_not have_been_made

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_content(old_ssn)
        expect(page).to_not have_content(new_ssn)
      end
    end
  end

  scenario 'when a user clicks cancel on edit page' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      fill_in 'Social security number', with: new_ssn
      click_button 'Cancel'
    end

    expect(page).to have_content 'MARGE SIMPSON'
    expect(page).to have_link 'Edit participant'
    expect(page).to have_content old_ssn
  end

  scenario 'when a user edits a participants role in a screening' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      has_react_select_field('Role', with: %w(Victim Perpetrator))

      remove_react_select_option('Role', 'Perpetrator')
      expect(page).to have_no_content('Perpetrator')

      marge.roles = ['Victim']
      stub_request(:put, api_participant_path(marge.id))
        .with(body: remove_root_id(marge.as_json))
        .and_return(json_body(marge.to_json, status: 200))

      within '.card-body' do
        click_button 'Save'
      end
    end

    expect(
      a_request(:put, api_participant_path(marge.id))
      .with(json_body(remove_root_id(marge.as_json)))
    ).to have_been_made

    expect(page).to have_selector(show_participant_card_selector(marge.id))
  end

  context 'A participant has an existing reporter role' do
    let(:marge_roles) { ['Mandated Reporter'] }

    scenario 'the other reporter roles are unavailable' do
      visit edit_screening_path(id: screening.id)

      within edit_participant_card_selector(marge.id) do
        fill_in_react_select('Role', with: 'Non-mandated Reporter')
        has_react_select_field('Role', with: ['Mandated Reporter'])

        remove_react_select_option('Role', 'Mandated Reporter')
        fill_in_react_select('Role', with: 'Non-mandated Reporter')
        has_react_select_field('Role', with: ['Non-mandated Reporter'])
      end
    end
  end
end
