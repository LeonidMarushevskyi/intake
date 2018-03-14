# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Adding and removing a person from a snapshot' do
  around do |example|
    Feature.run_with_activated(:release_two) do
      example.run
    end
  end

  let(:snapshot) { FactoryGirl.create(:screening) }
  let(:person) do
    FactoryGirl.create(
      :participant,
      first_name: 'Marge',
      screening_id: snapshot.id,
      phone_numbers: [FactoryGirl.create(:phone_number, number: '9712876774')],
      languages: %w[French Italian],
      addresses: [FactoryGirl.create(:address, state: 'CA')]
    )
  end

  before do
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(snapshot.to_json, status: 201))
    stub_system_codes
    stub_request(
      :get,
      ferb_api_url(
        ExternalRoutes.ferb_api_screening_history_of_involvements_path(snapshot.id)
      )
    ).and_return(json_body({}.to_json, status: 200))
    stub_request(
      :get,
      intake_api_url(
        ExternalRoutes.intake_api_relationships_by_screening_path(snapshot.id)
      )
    ).and_return(json_body([].to_json, status: 200))

    search_response = PersonSearchResponseBuilder.build do |response|
      response.with_total(1)
      response.with_hits do
        [
          PersonSearchResultBuilder.build do |builder|
            builder.with_first_name('Marge')
          end
        ]
      end
    end

    stub_person_search(search_term: 'Ma', person_response: search_response)
    stub_request(
      :post,
      intake_api_url(ExternalRoutes.intake_api_screening_people_path(snapshot.id))
    ).and_return(json_body(person.to_json, status: 201))
    stub_request(
      :delete,
      intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
    ).and_return(json_body(nil, status: 204))
  end

  scenario 'User can add and remove users on snapshot' do
    visit snapshot_path

    within '#search-card', text: 'Search' do
      fill_in 'Search for clients', with: 'Ma'
    end

    within '#search-card', text: 'Search' do
      expect(page).not_to have_content 'Create a new person'
      page.find('strong', text: 'Marge').click
    end

    expect(
      a_request(
        :post, intake_api_url(ExternalRoutes.intake_api_screening_people_path(snapshot.id))
      )
    ).to have_been_made

    within show_participant_card_selector(person.id) do
      within '.card-body' do
        expect(page).to have_content(person.first_name)
        expect(page).to have_content(person.last_name)
        expect(page).to have_content('(971)287-6774')
        expect(page).to have_content(person.phone_numbers.first.type)
        expect(page).to have_content(person.gender.capitalize)
        expect(page).to have_content('French (Primary), Italian')
        expect(page).to have_content(Date.parse(person.date_of_birth).strftime('%m/%d/%Y'))
        expect(page).to have_content(person.ssn)
        expect(page).to have_content(person.addresses.first.street_address)
        expect(page).to have_content(person.addresses.first.city)
        expect(page).to have_content('California')
        expect(page).to have_content(person.addresses.first.zip)
        expect(page).to have_content(person.addresses.first.type)
      end

      within '.card-header' do
        expect(page).not_to have_content 'Edit'
        expect(page).to_not have_content('Sensitive')
        expect(page).to have_content("#{person.first_name} #{person.last_name}")
        click_button 'Remove person'
      end
    end

    expect(
      a_request(
        :delete, intake_api_url(ExternalRoutes.intake_api_participant_path(person.id))
      )
    ).to have_been_made

    expect(
      a_request(
        :get,
        ferb_api_url(
          ExternalRoutes.ferb_api_screening_history_of_involvements_path(snapshot.id)
        )
      )
    ).to have_been_made.times(2)

    expect(
      a_request(
        :get,
        intake_api_url(
          ExternalRoutes.intake_api_relationships_by_screening_path(snapshot.id)
        )
      )
    ).to have_been_made.times(2)

    expect(page).not_to have_content show_participant_card_selector(person.id)
    expect(page).not_to have_content(person.first_name)
  end

  scenario 'Clicking Start Over removes people from the snapshot page' do
    visit snapshot_path

    within '#search-card', text: 'Search' do
      fill_in 'Search for clients', with: 'Ma'
    end

    within '#search-card', text: 'Search' do
      expect(page).not_to have_content 'Create a new person'
      page.find('strong', text: 'Marge').click
    end

    expect(
      a_request(
        :post, intake_api_url(ExternalRoutes.intake_api_screening_people_path(snapshot.id))
      )
    ).to have_been_made

    within show_participant_card_selector(person.id) do
      within '.card-header' do
        expect(page).to have_content("#{person.first_name} #{person.last_name}")
      end
    end

    click_button 'Start Over'

    expect(page).not_to have_content show_participant_card_selector(person.id)
    expect(page).not_to have_content(person.first_name)
  end
end
