# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

def filtered_participant_attributes
  %i[
    date_of_birth
    first_name
    gender
    last_name
    ssn
  ]
end

def build_participant_from_person_and_screening(person, screening)
  person.as_json(
    only: filtered_participant_attributes
  ).merge(
    legacy_id: person.id,
    legacy_source_table: person.legacy_source_table,
    legacy_friendly_id: person.legacy_descriptor[:legacy_ui_id],
    legacy_friendly_table: person.legacy_descriptor[:legacy_table_description],
    screening_id: screening.id.to_s,
    addresses: person.addresses,
    phone_numbers: person.phone_numbers,
    languages: person.languages
  )
end

feature 'Edit Screening' do
  let(:existing_participant) { FactoryGirl.create(:participant) }
  let(:existing_screening) { FactoryGirl.create(:screening, participants: [existing_participant]) }
  let(:marge_date_of_birth) { 15.years.ago.to_date }
  let(:marge_address) do
    FactoryGirl.create(
      :address,
      :with_legacy,
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
    FactoryGirl.create(
      :person_search,
      legacy_source_table: 'CLIENT_T',
      legacy_descriptor: {
        legacy_ui_id: '123-456-789',
        legacy_table_description: 'Client'
      },
      date_of_birth: marge_date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      languages: %w[French Italian],
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
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(existing_screening.id)))
      .and_return(json_body(existing_screening.to_json, status: 200))
    %w[Ma Mar Marg Marge].each do |search_text|
      stub_request(
        :get,
        host_url(ExternalRoutes.intake_api_people_search_path(search_term: search_text))
      ).and_return(json_body([marge].to_json, status: 200))
    end
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(existing_screening.id))
    ).and_return(json_body([].to_json, status: 200))
    visit edit_screening_path(id: existing_screening.id)
  end

  scenario 'adding an unknown participant when autocompleter contains results' do
    created_participant_unknown = FactoryGirl.create(
      :participant, :unpopulated,
      screening_id: existing_screening.id
    )
    new_participant_request = {
      screening_id: existing_screening.id,
      legacy_id: nil,
      legacy_source_table: nil,
      legacy_friendly_id: nil,
      legacy_friendly_table: nil
    }

    stub_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
      .with(body: created_participant_unknown.as_json(except: :id).merge(new_participant_request))
      .and_return(json_body(created_participant_unknown.to_json, status: 201))
    within '#search-card', text: 'Search' do
      fill_in_autocompleter 'Search for any person', with: 'Marge'
      find('.btn', text: /Create a new person/).click
      expect(page).not_to have_content('Create a new person')
    end

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
      .with(body: hash_including(new_participant_request)))
      .to have_been_made

    within edit_participant_card_selector(created_participant_unknown.id) do
      within '.card-header' do
        expect(page).to have_content 'Unknown Person'
      end
    end
  end

  context 'release_two enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end
    it 'hides the create new person button' do
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marge'
        expect(page).not_to have_button('Create a new person')
      end
    end
  end

  scenario 'creating a new participant from a person' do
    marge_attributes = build_participant_from_person_and_screening(marge, existing_screening)
    participant_marge = FactoryGirl.build(:participant, marge_attributes)
    created_participant_marge = FactoryGirl.create(:participant, participant_marge.as_json)
    stub_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
      .and_return(json_body(created_participant_marge.to_json, status: 201))

    fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

    within '#search-card', text: 'Search' do
      fill_in_autocompleter 'Search for any person', with: 'Marge'
      find('li', text: 'Marge Simpson').click
    end

    expect(a_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
      .with(json_body(participant_marge.to_json(except: :id)))).to have_been_made

    # adding participant doesnt change screening modifications
    expect(page).to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

    # The new participant was added to the top of the list of participants
    created_participant_selector = edit_participant_card_selector(created_participant_marge.id)
    existing_participant_selector = edit_participant_card_selector(existing_participant.id)
    expect(find("#{created_participant_selector}+div")).to match_css(existing_participant_selector)

    within edit_participant_card_selector(created_participant_marge.id) do
      within '.card-header' do
        expect(page).to have_content 'Marge Simpson'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: marge.first_name)
        expect(page).to have_field('Last Name', with: marge.last_name)
        expect(page).to have_field('Phone Number', with: marge.phone_numbers.first.number)
        expect(page).to have_field('Phone Number Type', with: marge.phone_numbers.first.type)
        expect(page).to have_field('Gender', with: marge.gender)
        has_react_select_field('Language(s)', with: marge.languages)
        expect(page).to have_field('Date of birth', with: marge_date_of_birth.strftime('%m/%d/%Y'))
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

  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'creating a participant from search adds participant in show mode' do
      marge_attributes = build_participant_from_person_and_screening(marge, existing_screening)
      participant_marge = FactoryGirl.build(:participant, marge_attributes)
      created_participant_marge = FactoryGirl.create(:participant, participant_marge.as_json)
      stub_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
        .and_return(json_body(created_participant_marge.to_json, status: 201))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marge'
        find('li', text: 'Marge Simpson').click
      end

      expect(a_request(:post, host_url(ExternalRoutes.intake_api_participants_path))
        .with(json_body(participant_marge.to_json(except: :id)))).to have_been_made

      within show_participant_card_selector(created_participant_marge.id) do
        within '.card-header' do
          expect(page).to have_content('Marge Simpson')
          expect(page).to_not have_link 'Edit participant'
          expect(page).to have_button 'Delete participant'
        end

        within '.card-body' do
          expect(page).to have_content(marge.first_name)
          expect(page).to have_content(marge.last_name)
          expect(page).to have_content(marge.phone_numbers.first.number)
          expect(page).to have_content(marge.phone_numbers.first.type)
          expect(page).to have_content(marge.gender.capitalize)
          expect(page).to have_content(marge.languages.join(', '))
          expect(page).to have_content(Date.parse(marge.date_of_birth).strftime('%m/%d/%Y'))
          expect(page).to have_content(marge.ssn)
          expect(page).to have_content(marge.addresses.first.street_address)
          expect(page).to have_content(marge.addresses.first.city)
          expect(page).to have_content('New York')
          expect(page).to have_content(marge.addresses.first.zip)
          expect(page).to have_content(marge.addresses.first.type)
        end
      end
    end
  end
end
