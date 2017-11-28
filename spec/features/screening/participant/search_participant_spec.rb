# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'
feature 'searching a participant in autocompleter' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:date_of_birth) { 15.years.ago.to_date }
  let(:address) do
    FactoryGirl.create(
      :address,
      street_address: '123 Fake St',
      city: 'Springfield',
      state: 'NY',
      zip: '12345',
      type: 'Work'
    )
  end
  let(:phone_number) do
    FactoryGirl.create(
      :phone_number,
      number: '971-287-6774',
      type: 'Home'
    )
  end
  let(:person) do
    FactoryGirl.create(
      :person_search,
      date_of_birth: date_of_birth.to_s(:db),
      first_name: 'Marge',
      middle_name: 'Jacqueline',
      name_suffix: 'md',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123231234',
      languages: %w[French Italian],
      addresses: [address],
      phone_numbers: [phone_number],
      races: [
        { race: 'White', race_detail: 'European' },
        { race: 'American Indian or Alaska Native' }
      ],
      ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: ['Central American'] },
      sensitive: true,
      sealed: false
    )
  end
  before do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'search for a person' do
    scenario 'search result contains person information' do
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([person].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
        expect(page).to have_content 'Showing 1 of 1 results'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female, White, American Indian or Alaska Native'
        expect(page).to have_content 'Hispanic/Latino'
        expect(page).to have_content 'Language'
        expect(page).to have_content 'French (Primary), Italian'
        expect(page).to have_content 'Home'
        expect(page).to have_content '971-287-6774'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '1234'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Work'
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'search contains no results' do
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'No'))
      ).and_return(json_body([].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'No', skip_select: true
        expect(page).to have_content 'No results were found for'
      end
    end

    scenario 'search results format the SSN' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        ssn: '123456789'
      )
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([marge].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content '123-45-6789'
      end
    end

    scenario 'results include information about the legacy source information for a person' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        legacy_descriptor: { legacy_ui_id: '123-456-789', legacy_table_description: 'Client' }
      )
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([marge].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content 'Client ID 123-456-789 in CWS-CMS'
      end
    end

    scenario 'person without phone_numbers' do
      person_with_out_phone_numbers = person.as_json.except('phone_numbers')
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([person_with_out_phone_numbers].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-phone'
      end
    end

    scenario 'person without addresses' do
      person_with_out_addresses = person.as_json.except('addresses')
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([person_with_out_addresses].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-map-marker'
      end
    end

    scenario 'person who is neither sensitive nor sealed' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        sensitive: false,
        sealed: false
      )
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([marge].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sensitive' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        sensitive: true,
        sealed: false
      )
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([marge].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sealed' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        sensitive: false,
        sealed: true
      )
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: 'Ma'))
      ).and_return(json_body([marge].to_json, status: 200))

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to have_content 'Sealed'
      end
    end
  end
end
