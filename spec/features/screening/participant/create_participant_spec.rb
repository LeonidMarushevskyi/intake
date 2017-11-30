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
    sealed
    sensitive
  ]
end

def build_participant_from_person_and_screening(person, screening)
  person.as_json(
    only: filtered_participant_attributes
  ).merge(
    legacy_id: person.id,
    legacy_source_table: person.legacy_source_table,
    legacy_descriptor: person.legacy_descriptor,
    races: person.races,
    screening_id: screening.id.to_s,
    addresses: person.addresses,
    phone_numbers: person.phone_numbers,
    languages: person.languages,
    ethnicity: person.ethnicity
  )
end

feature 'Create participant' do
  let(:existing_participant) { FactoryGirl.create(:participant) }
  let(:existing_screening) { FactoryGirl.create(:screening, participants: [existing_participant]) }
  let(:marge_date_of_birth) { 15.years.ago.to_date }
  let(:homer_date_of_birth) { 16.years.ago.to_date }
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
      number: '9712876774',
      type: 'Home'
    )
  end
  let(:marge) do
    FactoryGirl.create(
      :person_search,
      legacy_source_table: 'CLIENT_T',
      date_of_birth: marge_date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      sealed: false,
      sensitive: true,
      languages: %w[French Italian],
      legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
      addresses: [marge_address],
      phone_numbers: [marge_phone_number],
      races: [
        { race: 'White', race_detail: 'European' },
        { race: 'American Indian or Alaska Native' }
      ],
      ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: ['Central American'] }
    )
  end
  let(:homer) do
    FactoryGirl.create(
      :person_search,
      legacy_source_table: 'CLIENT_T',
      date_of_birth: homer_date_of_birth.to_s(:db),
      first_name: 'Homer',
      gender: 'male',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      sealed: false,
      sensitive: false,
      languages: %w[French Italian],
      legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
      addresses: [marge_address],
      phone_numbers: [marge_phone_number],
      races: [
        { race: 'Asian' },
        { race: 'White' },
        { race: 'White', race_detail: 'Romanian' },
        { race: 'Asian', race_detail: 'Hmong' },
        { race: 'Asian', race_detail: 'Chinese' },
        { race: 'American Indian or Alaska Native' }
      ],
      ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: %w[Hispanic Mexican] }
    )
  end

  before do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    %w[Ma Mar Marg Marge].each do |search_text|
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
      ).and_return(json_body([marge].to_json, status: 200))
    end
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    %w[Ho Homer].each do |search_text|
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
      ).and_return(json_body([homer].to_json, status: 200))
    end
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
  end

  scenario 'creating an unknown participant' do
    visit edit_screening_path(id: existing_screening.id)
    created_participant_unknown = FactoryGirl.create(
      :participant, :unpopulated,
      screening_id: existing_screening.id
    )
    new_participant_request = {
      screening_id: existing_screening.id,
      legacy_id: nil,
      legacy_source_table: nil,
      legacy_descriptor: nil
    }

    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .with(body: created_participant_unknown.as_json(except: :id).merge(new_participant_request))
      .and_return(json_body(created_participant_unknown.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in_autocompleter 'Search for any person', with: 'Marge'
      click_button 'Create a new person'
      expect(page).to_not have_button('Create a new person')
    end

    expect(a_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .with(body: hash_including(new_participant_request)))
      .to have_been_made

    within edit_participant_card_selector(created_participant_unknown.id) do
      within '.card-header' do
        expect(page).to_not have_content('Sensitive')
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
      visit edit_screening_path(id: existing_screening.id)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for clients', with: 'Marge'
        expect(page).to_not have_button('Create a new person')
      end
    end
  end

  scenario 'adding a participant from search on show screening page' do
    visit screening_path(id: existing_screening.id)
    homer_attributes = build_participant_from_person_and_screening(homer, existing_screening)
    participant_homer = FactoryGirl.build(:participant, homer_attributes)
    created_participant_homer = FactoryGirl.create(:participant, participant_homer.as_json)
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .and_return(json_body(created_participant_homer.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in_autocompleter 'Search for any person', with: 'Homer'
      find('li', text: 'Homer Simpson').click
    end
    expect(a_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .with(json_body(participant_homer.to_json(except: :id)))).to have_been_made

    within edit_participant_card_selector(created_participant_homer.id) do
      within '.card-header' do
        expect(page).to_not have_content('Sensitive')
        expect(page).to have_content 'Homer Simpson'
        expect(page).to have_button 'Delete person'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: homer.first_name)
        expect(page).to have_field('Last Name', with: homer.last_name)
        expect(page).to have_field('Phone Number', with: '(971)287-6774')
        expect(page).to have_select('Phone Number Type', selected: homer.phone_numbers.first.type)
        expect(page).to have_field('Gender', with: homer.gender)
        expect(page).to have_react_select_field(
          'Language(s) (Primary First)', with: homer.languages
        )
        expect(page).to have_field('Date of birth', with: homer_date_of_birth.strftime('%m/%d/%Y'))
        expect(page).to have_field('Social security number', with: homer.ssn)
        expect(page).to have_field('Address', with: homer.addresses.first.street_address)
        expect(page).to have_field('City', with: homer.addresses.first.city)
        expect(page).to have_field('State', with: homer.addresses.first.state)
        expect(page).to have_field('Zip', with: homer.addresses.first.zip)
        expect(page).to have_select('Address Type', selected: homer.addresses.first.type)
        within 'fieldset', text: 'Race' do
          expect(page).to have_checked_field('Asian')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-Asian-race-detail",
            selected: 'Chinese'
          )
          expect(page).to have_checked_field('White')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-White-race-detail",
            selected: 'Romanian'
          )
          expect(page).to have_checked_field('American Indian or Alaska Native')
        end
        within 'fieldset', text: 'Hispanic/Latino Origin' do
          expect(page).to have_checked_field('Yes')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-ethnicity-detail",
            selected: 'Hispanic'
          )
        end
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end

  scenario 'adding a participant from search on edit screening page' do
    visit edit_screening_path(id: existing_screening.id)
    homer_attributes = build_participant_from_person_and_screening(homer, existing_screening)
    participant_homer = FactoryGirl.build(:participant, homer_attributes)
    created_participant_homer = FactoryGirl.create(:participant, participant_homer.as_json)
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .and_return(json_body(created_participant_homer.to_json, status: 201))

    fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

    within '#search-card', text: 'Search' do
      fill_in_autocompleter 'Search for any person', with: 'Homer'
      find('li', text: 'Homer Simpson').click
    end
    expect(a_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
      .with(json_body(participant_homer.to_json(except: :id)))).to have_been_made

    # adding participant doesnt change screening modifications
    expect(page).to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

    # The new participant was added to the top of the list of participants
    created_participant_selector = edit_participant_card_selector(created_participant_homer.id)
    existing_participant_selector = edit_participant_card_selector(existing_participant.id)
    expect(find("#{created_participant_selector}+div")).to match_css(existing_participant_selector)

    within edit_participant_card_selector(created_participant_homer.id) do
      within '.card-header' do
        expect(page).to_not have_content('Sensitive')
        expect(page).to have_content 'Homer Simpson'
        expect(page).to have_button 'Delete person'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: homer.first_name)
        expect(page).to have_field('Last Name', with: homer.last_name)
        expect(page).to have_field('Phone Number', with: '(971)287-6774')
        expect(page).to have_select('Phone Number Type', selected: homer.phone_numbers.first.type)
        expect(page).to have_field('Gender', with: homer.gender)
        expect(page).to have_react_select_field(
          'Language(s) (Primary First)', with: homer.languages
        )
        expect(page).to have_field('Date of birth', with: homer_date_of_birth.strftime('%m/%d/%Y'))
        expect(page).to have_field('Social security number', with: homer.ssn)
        expect(page).to have_field('Address', with: homer.addresses.first.street_address)
        expect(page).to have_field('City', with: homer.addresses.first.city)
        expect(page).to have_field('State', with: homer.addresses.first.state)
        expect(page).to have_field('Zip', with: homer.addresses.first.zip)
        expect(page).to have_select('Address Type', selected: homer.addresses.first.type)
        within 'fieldset', text: 'Race' do
          expect(page).to have_checked_field('Asian')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-Asian-race-detail",
            selected: 'Chinese'
          )
          expect(page).to have_checked_field('White')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-White-race-detail",
            selected: 'Romanian'
          )
          expect(page).to have_checked_field('American Indian or Alaska Native')
        end
        within 'fieldset', text: 'Hispanic/Latino Origin' do
          expect(page).to have_checked_field('Yes')
          expect(page).to have_select(
            "participant-#{created_participant_homer.id}-ethnicity-detail",
            selected: 'Hispanic'
          )
        end
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end

  context 'adding a sensitive participant from search results' do
    let(:sensitive_token) { 'SENSITIVE_TOKEN' }
    let(:insensitive_token) { 'INSENSITIVE_TOKEN' }

    before do
      stub_request(:get, %r{https?://.*/authn/validate\?token=#{sensitive_token}})
        .and_return(status: 200,
                    body: { staffId: '123', privileges: ['Sensitive Persons'] }.to_json)
      stub_request(:get, %r{https?://.*/authn/validate\?token=#{insensitive_token}})
        .and_return(status: 200, body: { staffId: '123', privileges: [] }.to_json)
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_staff_path('123')))
        .and_return(json_body({ staffId: '123', first_name: 'Bob', last_name: 'Boberson',
                                county: 'San Francisco' }.to_json, status: 200))
    end

    context 'with NO privileges to add sensitive' do
      scenario 'cannot add sensitive' do
        Feature.run_with_activated(:authentication) do
          visit edit_screening_path(id: existing_screening.id, token: insensitive_token)
          sensitive_marge_attributes = build_participant_from_person_and_screening(
            marge,
            existing_screening
          )
          sensitive_participant_marge = FactoryGirl.build(:participant, sensitive_marge_attributes)
          created_participant_marge = FactoryGirl.create(
            :participant,
            sensitive_participant_marge.as_json
          )

          fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

          within '#search-card', text: 'Search' do
            fill_in_autocompleter 'Search for any person', with: 'Marge'
            find('li', text: 'Marge Simpson').click
          end

          # adding participant doesnt change screening modifications
          expect(page)
            .to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

          # The new participant was NOT added
          expect(page)
            .to_not have_selector(edit_participant_card_selector(created_participant_marge.id))
        end
      end

      scenario 'can add insensitive' do
        Feature.run_with_activated(:authentication) do
          visit edit_screening_path(id: existing_screening.id, token: insensitive_token)
          homer_attributes = build_participant_from_person_and_screening(
            homer,
            existing_screening
          )
          participant_homer = FactoryGirl.build(:participant, homer_attributes)
          created_participant_homer = FactoryGirl.create(
            :participant,
            participant_homer.as_json
          )
          stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
            .and_return(json_body(created_participant_homer.to_json, status: 201))

          fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

          within '#search-card', text: 'Search' do
            fill_in_autocompleter 'Search for any person', with: 'Ho'
            find('li', text: 'Homer Simpson').click
          end

          # adding participant doesnt change screening modifications
          expect(page)
            .to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

          # The new participant was NOT added
          expect(page)
            .to have_selector(edit_participant_card_selector(created_participant_homer.id))
        end
      end
    end

    context 'with privileges to add sensitive' do
      scenario 'can add sensitive person' do
        Feature.run_with_activated(:authentication) do
          visit edit_screening_path(id: existing_screening.id, token: sensitive_token)
          sensitive_marge_attributes = build_participant_from_person_and_screening(
            marge,
            existing_screening
          )
          sensitive_participant_marge = FactoryGirl.build(:participant, sensitive_marge_attributes)
          created_participant_marge = FactoryGirl.create(
            :participant,
            sensitive_participant_marge.as_json
          )
          stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
            .and_return(json_body(created_participant_marge.to_json, status: 201))

          fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

          within '#search-card', text: 'Search' do
            fill_in_autocompleter 'Search for any person', with: 'Marge'
            find('li', text: 'Marge Simpson').click
          end
          expect(a_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
            .with(json_body(sensitive_participant_marge.to_json(except: :id)))).to have_been_made

          # adding participant doesnt change screening modifications
          expect(page)
            .to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

          # The new participant was added to the top of the list of participants
          created_participant_selector = edit_participant_card_selector(
            created_participant_marge.id
          )
          existing_participant_selector = edit_participant_card_selector(existing_participant.id)
          expect(find("#{created_participant_selector}+div"))
            .to match_css(existing_participant_selector)

          expect(page)
            .to have_selector(edit_participant_card_selector(created_participant_marge.id))
          within edit_participant_card_selector(created_participant_marge.id) do
            within '.card-header' do
              expect(page).to have_content('Sensitive')
              expect(page).to have_content 'Marge Simpson'
              expect(page).to have_button 'Delete person'
            end
          end
        end
      end
      scenario 'can add sensitive person' do
        Feature.run_with_activated(:authentication) do
          visit edit_screening_path(id: existing_screening.id, token: sensitive_token)
          homer_attributes = build_participant_from_person_and_screening(
            homer,
            existing_screening
          )
          participant_homer = FactoryGirl.build(:participant, homer_attributes)
          created_participant_homer = FactoryGirl.create(
            :participant,
            participant_homer.as_json
          )
          stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
            .and_return(json_body(created_participant_homer.to_json, status: 201))

          fill_in 'Title/Name of Screening', with: 'The Rocky Horror Picture Show'

          within '#search-card', text: 'Search' do
            fill_in_autocompleter 'Search for any person', with: 'Ho'
            find('li', text: 'Homer Simpson').click
          end

          # adding participant doesnt change screening modifications
          expect(page)
            .to have_field('Title/Name of Screening', with: 'The Rocky Horror Picture Show')

          expect(page)
            .to have_selector(edit_participant_card_selector(created_participant_homer.id))
        end
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
      visit edit_screening_path(id: existing_screening.id)
      homer_attributes = build_participant_from_person_and_screening(homer, existing_screening)
      participant_homer = FactoryGirl.build(:participant, homer_attributes)
      created_participant_homer = FactoryGirl.create(:participant, participant_homer.as_json)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
        .and_return(json_body(created_participant_homer.to_json, status: 201))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for clients', with: 'Ho'
        find('li', text: 'Homer Simpson').click
      end

      expect(a_request(:post, intake_api_url(ExternalRoutes.intake_api_participants_path))
        .with(json_body(participant_homer.to_json(except: :id)))).to have_been_made

      within show_participant_card_selector(created_participant_homer.id) do
        within '.card-header' do
          expect(page).to_not have_content('Sensitive')
          expect(page).to have_content('Homer Simpson')
          expect(page).to_not have_link 'Edit person'
          expect(page).to have_button 'Delete person'
        end

        within '.card-body' do
          expect(page).to have_content(homer.first_name)
          expect(page).to have_content(homer.last_name)
          expect(page).to have_content('(971)287-6774')
          expect(page).to have_content(homer.phone_numbers.first.type)
          expect(page).to have_content(homer.gender.capitalize)
          expect(page).to have_content('French (Primary), Italian')
          expect(page).to have_content(Date.parse(homer.date_of_birth).strftime('%m/%d/%Y'))
          expect(page).to have_content(homer.ssn)
          expect(page).to have_content(homer.addresses.first.street_address)
          expect(page).to have_content(homer.addresses.first.city)
          expect(page).to have_content('New York')
          expect(page).to have_content(homer.addresses.first.zip)
          expect(page).to have_content(homer.addresses.first.type)
        end
      end
    end
  end
end
