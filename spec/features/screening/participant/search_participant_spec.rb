# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'
feature 'searching a person' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  before do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'in TPT API' do
    before do
      stub_request(:get, intake_api_people_search_v2_url(search_term: 'aa'))
        .and_return(body: [],
                    status: 200,
                    headers: { 'Content-Type' => 'application/json' })
    end
    scenario 'I search for a person' do
      Feature.run_with_activated(:people_search_tpt) do
        within '#search-card', text: 'Search' do
          fill_in_autocompleter 'Search for any person', with: 'aa', skip_select: true
        end

        expect(
          a_request(:get, intake_api_people_search_v2_url(search_term: 'aa'))
        ).to have_been_made
      end
    end
  end

  context 'in intake API' do
    before do
      stub_request(:get, intake_api_people_search_url(search_term: 'aa'))
        .and_return(body: [],
                    status: 200,
                    headers: { 'Content-Type' => 'application/json' })
    end
    scenario 'I search for a person' do
      Feature.run_with_deactivated(:people_search_tpt) do
        within '#search-card', text: 'Search' do
          fill_in_autocompleter 'Search for any person', with: 'aa', skip_select: true
        end
        expect(
          a_request(:get, intake_api_people_search_url(search_term: 'aa'))
        ).to have_been_made
      end
    end
  end
end

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
      ssn: '123-23-1234',
      languages: %w[French Italian],
      addresses: [address],
      phone_numbers: [phone_number],
      races: [
        { race: 'White', race_detail: 'European' },
        { race: 'American Indian or Alaska Native' }
      ],
      ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: 'Central American' }
    )
  end
  before do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'searching for a person' do
    scenario 'by first name' do
      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [person].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
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
        expect(page).to have_content 'French, Italian'
        expect(page).to have_content 'Home'
        expect(page).to have_content '971-287-6774'
        expect(page).to have_content 'SSN'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Work'
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
      end
    end

    scenario 'search matches on first name are highlighted in search results' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        highlight: { first_name: '<em>Marg</em>e' }
      )
      %w[M Ma Mar Marg].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [marge].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Marg'
      end

      within '.react-autosuggest__suggestions-list em' do
        expect(page).to have_content 'Marg'
        expect(page).to_not have_content 'e'
      end
    end

    scenario 'person without phone_numbers' do
      person_with_out_phone_numbers = person.as_json.except('phone_numbers')

      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [person_with_out_phone_numbers].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
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
        expect(page).to have_content 'French, Italian'
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Work'
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to_not have_content '971-287-6774'
        expect(page).to_not have_content 'Home'
      end
    end

    scenario 'person without addresses' do
      person_with_out_addresses = person.as_json.except('addresses')

      ['12', '123', '123-', '123-2', '123-23', '123-23-',
       '123-23-1', '123-23-12', '123-23-123', '123-23-1234'].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [person_with_out_addresses].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
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
        expect(page).to have_content '123-23-1234'
        expect(page).to have_content 'Language'
        expect(page).to have_content 'French, Italian'
        expect(page).to have_content 'Home'
        expect(page).to have_content '971-287-6774'
        expect(page).to_not have_content 'Work'
        expect(page).to_not have_content '123 Fake St, Springfield, NY 12345'
      end
    end

    scenario 'person with name only' do
      person_with_name_only = person.as_json.extract!('first_name', 'last_name')
      %w[Ma Mar Marg Marge].each do |search_text|
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [person_with_name_only].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
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
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [marge].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
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
        stub_request(:get, intake_api_people_search_url(search_term: search_text))
          .and_return(body: [marge].to_json,
                      status: 200,
                      headers: { 'Content-Type' => 'application/json' })
      end

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: '566'
      end

      within '.react-autosuggest__suggestions-list em' do
        expect(page).to have_content '566'
        expect(page).to_not have_content '-23-8765'
      end
    end
  end
end
