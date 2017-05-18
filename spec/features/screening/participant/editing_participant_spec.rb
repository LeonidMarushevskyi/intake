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
  let(:marge_roles) { %w[Victim Perpetrator] }
  let(:marge_phone_number) do
    FactoryGirl.create(
      :phone_number
    )
  end
  let(:marge) do
    FactoryGirl.create(
      :participant,
      legacy_id: 1,
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      middle_name: 'Jacqueline',
      last_name: 'Simpson',
      name_suffix: 'sr',
      gender: 'female',
      ssn: old_ssn,
      languages: ['Armenian'],
      addresses: [marge_address],
      phone_numbers: [marge_phone_number],
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
      legacy_id: 2,
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
    stub_request(:get, intake_api_screening_url(screening.id))
      .and_return(
        body: screening.to_json,
        status: 200,
        headers: { 'Content-Type' => 'application/json' }
      )
    stub_request(
      :get,
      intake_api_history_of_involvements_url(screening.id)
    ).and_return(json_body([].to_json, status: 200))
  end

  scenario 'editing and saving a participant for a screening saves only the relevant participant' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within '.card-header' do

        expect(page).to have_content 'Marge Jacqueline Simpson, Sr'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_selector("#address-#{marge_address.id}")
        expect(page).to have_field('First Name', with: marge.first_name)
        expect(page).to have_field('Middle Name', with: marge.middle_name)
        expect(page).to have_field('Last Name', with: marge.last_name)
        expect(page).to have_field('Suffix', with: marge.name_suffix)
        expect(page).to have_field('Phone Number', with: marge.phone_numbers.first.number)
        expect(page).to have_field('Phone Number Type', with: marge.phone_numbers.first.type)
        expect(page).to have_field('Gender', with: marge.gender)
        has_react_select_field('Language(s)', with: marge.languages)
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

      stub_request(:put, intake_api_participant_url(marge.id))
        .with(body: as_json_without_root_id(marge))
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
        a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))
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

  scenario 'editing and then removing a phone number from a participant' do
    visit edit_screening_path(id: screening.id)
    old_phone = marge.phone_numbers.first.number

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector('#phone-numbers')
        expect(page).to have_field('Phone Number', with: marge.phone_numbers.first.number)
        expect(page).to have_field('Phone Number Type', with: marge.phone_numbers.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'Phone Number', with: '789-456-1245'
      end

      marge.phone_numbers.first.number = '789-456-1245'

      stub_request(:put, intake_api_participant_url(marge.id))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#phone-number-#{marge.phone_numbers.first.id}")
        expect(page).to have_content('789-456-1245')
        expect(page).to_not have_content(old_phone)
      end

      within '.card-header' do
        click_link 'Edit participant'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        within '#phone-numbers' do
          click_link 'Delete phone number'
        end

        expect(page).to_not have_content('789-456-1245')
      end
    end

    marge.phone_numbers = []

    stub_request(:put, intake_api_participant_url(marge.id))
      .with(body: as_json_without_root_id(marge))
      .and_return(json_body(marge.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
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

      stub_request(:put, intake_api_participant_url(marge.id))
        .with(body: as_json_without_root_id(marge))
        .and_return(status: 200,
                    body: marge.to_json,
                    headers: { 'Content-Type' => 'application/json' })
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))
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

    stub_request(:put, intake_api_participant_url(marge.id))
      .with(body: as_json_without_root_id(marge))
      .and_return(status: 200,
                  body: marge.to_json,
                  headers: { 'Content-Type' => 'application/json' })

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end
  end

  scenario 'when a user modifies languages for an existing participant' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      within('.col-md-6', text: 'Language(s)') do
        fill_in_react_select 'Language(s)', with: 'English'
        fill_in_react_select 'Language(s)', with: 'Farsi'
        remove_react_select_option('Language(s)', 'Armenian')
      end
      marge.languages = %w[English Farsi]
      stub_request(:put, intake_api_participant_url(marge.id))
        .with(body: marge.to_json)
        .and_return(status: 200,
                    body: marge.to_json,
                    headers: { 'Content-Type' => 'application/json' })
      stub_request(:get, intake_api_participant_url(marge.id))
        .and_return(status: 200,
                    body: marge.to_json,
                    headers: { 'Content-Type' => 'application/json' })

      click_button 'Save'
      expect(a_request(:put, intake_api_participant_url(marge.id))
        .with(json_body(as_json_without_root_id(marge)))).to have_been_made
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

    expect(a_request(:put, intake_api_participant_url(marge.id))).to_not have_been_made

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

    expect(page).to have_content 'Marge Jacqueline Simpson, Sr'
    expect(page).to have_link 'Edit participant'
    expect(page).to have_content old_ssn
  end

  scenario 'when a user edits a participants role in a screening' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      has_react_select_field('Role', with: %w[Victim Perpetrator])
      remove_react_select_option('Role', 'Perpetrator')
      expect(page).to have_no_content('Perpetrator')

      marge.roles = ['Victim']
      stub_request(:put, intake_api_participant_url(marge.id))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))

      within '.card-body' do
        click_button 'Save'
      end
    end

    expect(
      a_request(:put, intake_api_participant_url(marge.id))
      .with(json_body(as_json_without_root_id(marge)))
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
