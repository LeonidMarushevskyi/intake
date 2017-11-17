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

  context 'searching for a person' do
    scenario 'by first name' do
      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([person].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marge'
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

    scenario 'search matches on first name are highlighted in search results' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        highlight: { first_name: '<em>Marg</em>e' }
      )
      %w[M Ma Mar Marg].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marg'
      end

      within '.react-autosuggest__suggestions-list em' do
        expect(page).to have_content 'Marg'
        expect(page).to_not have_content 'e'
      end
    end

    scenario 'search results format the SSN' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        ssn: '123456789'
      )
      %w[M Ma Mar Marg].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marg'
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
      %w[M Ma Mar Marg].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marg'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content 'Client ID 123-456-789 in CWS-CMS'
      end
    end

    scenario 'person without phone_numbers' do
      person_with_out_phone_numbers = person.as_json.except('phone_numbers')
      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([person_with_out_phone_numbers].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marge'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female, White, American Indian or Alaska Native'
        expect(page).to have_content 'SSN'
        expect(page).to have_content 'Hispanic/Latino'
        expect(page).to have_content 'Language'
        expect(page).to have_content 'French (Primary), Italian'
        expect(page).to have_content '1234'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Work'
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to_not have_content '971-287-6774'
        expect(page).to_not have_content 'Home'
      end
    end

    scenario 'person without addresses' do
      person_with_out_addresses = person.as_json.except('addresses')

      %w[12 123 1232 12323 123231 1232312 12323123 123231234].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([person_with_out_addresses].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person',
          with: person.ssn, select_option_with: 'Marge'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to have_content date_of_birth.strftime('%-m/%-d/%Y')
        expect(page).to have_content '15 yrs old'
        expect(page).to have_content 'Female'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '1234'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Language'
        expect(page).to have_content 'French (Primary), Italian'
        expect(page).to have_content 'Home'
        expect(page).to have_content '971-287-6774'
        expect(page).to_not have_content 'Work'
        expect(page).to_not have_content '123 Fake St, Springfield, NY 12345'
      end
    end

    scenario 'person with name only' do
      person_with_name_only = person.as_json.extract!('first_name', 'last_name')
      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([person_with_name_only].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: person.first_name
      end

      within 'li', text: 'Marge Simpson' do
        expect(page).to_not have_content '15 yrs old'
        expect(page).to_not have_content '123-23-1234'
      end
    end

    scenario 'search matches on date of birth are highlighted in search results' do
      # matches (yyyy-mm-dd or mm/dd/yyyy) or search with 4 characters of year
      marge = FactoryGirl.create(
        :person_search,
        date_of_birth: '2011-09-30',
        highlight: { date_of_birth: '<em>2011</em>-09-30' }
      )
      %w[2 20 201 2011].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: '2011'
      end

      within '.react-autosuggest__suggestions-list em' do
        expect(page).to have_content '2011'
        expect(page).to_not have_content '9/30/'
      end
    end

    scenario 'search matches on SSN are highlighted in search results' do
      marge = FactoryGirl.create(
        :person_search,
        ssn: '566-23-8765',
        highlight: { first_name: '<em>566</em>-23-8765' }
      )
      %w[5 56 566].each do |search_text|
        stub_request(
          :get,
          intake_api_url(ExternalRoutes.intake_api_people_search_v2_path(search_term: search_text))
        ).and_return(json_body([marge].to_json, status: 200))
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: '566'
      end

      within '.react-autosuggest__suggestions-list em' do
        expect(page).to have_content '566'
        expect(page).to_not have_content '-23-8765'
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
