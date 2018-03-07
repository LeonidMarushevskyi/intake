# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'

feature 'Create participant' do
  let(:existing_participant) { FactoryGirl.create(:participant) }
  let(:existing_screening) { FactoryGirl.create(:screening, participants: [existing_participant]) }
  let(:marge) do
    FactoryGirl.create(
      :participant,
      :with_complete_address,
      phone_numbers: [],
      middle_name: 'j',
      name_suffix: 'sr',
      ssn: '555-56-7895',
      sealed: false,
      sensitive: true,
      races: [
        { race: 'Asian', race_detail: 'Hmong' }
      ],
      roles: [],
      languages: ['English'],
      ethnicity: {
        hispanic_latino_origin: 'Yes',
        ethnicity_detail: ['Mexican']
      }
    )
  end
  let(:marge_response) do
    PersonSearchResponseBuilder.build do |response|
      response.with_total(1)
      response.with_hits do
        [
          PersonSearchResultBuilder.build do |builder|
            builder.with_first_name('Marge')
            builder.with_last_name('Simpson')
            builder.with_sensitivity
          end
        ]
      end
    end
  end
  before do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    %w[ma mar marg marge marge\ simpson].each do |search_text|
      stub_person_search(search_term: search_text, person_response: marge_response)
    end
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
  end

  scenario 'create and edit an unknown participant' do
    visit edit_screening_path(id: existing_screening.id)

    stub_request(:post,
      intake_api_url(ExternalRoutes.intake_api_screening_people_path(existing_screening.id)))
      .and_return(json_body(marge.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in 'Search for any person', with: 'Marge'
      click_button 'Create a new person'
      expect(page).to_not have_button('Create a new person')
    end
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .and_return(json_body(marge.to_json, status: 201))

    within edit_participant_card_selector(marge.id) do
      click_button 'Save'
    end

    created_participant_unknown = FactoryGirl.create(
      :participant, :unpopulated,
      screening_id: existing_screening.id
    )

    stub_request(:post,
      intake_api_url(ExternalRoutes.intake_api_screening_people_path(existing_screening.id)))
      .and_return(json_body(created_participant_unknown.to_json, status: 201))

    within '#search-card', text: 'Search' do
      fill_in 'Search for any person', with: 'Marge'
      click_button 'Create a new person'
      expect(page).to_not have_button('Create a new person')
    end

    within edit_participant_card_selector(created_participant_unknown.id) do
      fill_in 'First Name', with: 'Second Person'
      expect(find_field('First Name').value).to eq('Second Person')
    end

    within all('.navlink')[1] do
      expect(page).to have_content 'People & Roles'
      expect(page).to have_content marge.first_name
      expect(page).to have_content 'Unknown Person'
    end
  end
end
