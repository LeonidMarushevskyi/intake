# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'
feature 'searching a participant in autocompleter' do
  def build_response_from_person(person)
    sealed_and_sensitive = 'N'
    sealed_and_sensitive = 'S' if person.sensitive
    sealed_and_sensitive = 'R' if person.sealed

    {
      hits: {
        total: 1,
        hits: [{
          _source: {
            id: person.id,
            legacy_source_table: 'CLIENT_T',
            first_name: person.first_name,
            gender: person.gender,
            last_name: person.last_name,
            middle_name: person.middle_name,
            name_suffix: person.name_suffix,
            ssn: person.ssn,
            phone_numbers: [{ 'number' => phone_number.number, 'type' => phone_number.type }],
            languages: [
              { name: 'French', primary: true },
              { name: 'Italian' }
            ],
            addresses: [{
              'legacy_id' => person.addresses.first.legacy_id,
              'legacy_source_table' => person.addresses.first.legacy_source_table,
              'street_number' => 123,
              'street_name' => 'Fake St',
              'state_code' => 'NY',
              'city' => 'Springfield',
              'zip' => '12345',
              'type' => ''
            }],
            date_of_birth: date_of_birth.to_s(:db),
            legacy_descriptor: {
              legacy_last_updated: person.legacy_descriptor.legacy_last_updated,
              legacy_id: person.legacy_descriptor.legacy_id,
              legacy_ui_id: person.legacy_descriptor.legacy_ui_id,
              legacy_table_name: person.legacy_descriptor.legacy_table_name,
              legacy_table_description: person.legacy_descriptor.legacy_table_description
            },
            race_ethnicity: {
              hispanic_origin_code: 'Y',
              race_codes: [
                { description: 'White - European*' },
                { description: 'Alaskan Native*' }
              ],
              hispanic_codes: [
                { description: 'Central American' }
              ],
              hispanic_unable_to_determine_code: ''
            },
            sensitivity_indicator: sealed_and_sensitive
          }
        }]
      }
    }
  end

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
      legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
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

  let(:marge_response) do
    build_response_from_person(person)
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
      built_response = build_response_from_person(person)
      stub_person_search('Ma', built_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
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
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'search result contains person information' do
      built_response = build_response_from_person(person)
      stub_person_search('Ma 12323', built_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma 123-23',
                                                       select_option_with: 'Marge', split: true
      end
      expect(
        a_request(
          :post,
          dora_api_url(Rails.application.routes.url_helpers.dora_people_light_index_path)
        )
            .with('body' => {
                    'query' => {
                      'bool' => {
                        'must' => array_including(
                          'multi_match' => hash_including('query' => 'ma 12323')
                        )
                      }
                    },
                    '_source' => anything,
                    'highlight' => anything
                  })
      ).to have_been_made
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
        expect(page).to have_content '123 Fake St, Springfield, NY 12345'
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'search results format the SSN' do
      marge = FactoryGirl.create(
        :person_search,
        first_name: 'Marge',
        addresses: [address],
        legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
        ssn: '123456789'
      )
      built_response = build_response_from_person(marge)
      stub_person_search('Ma', built_response)

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
        addresses: [address],
        legacy_descriptor: { legacy_ui_id: '123-456-789', legacy_table_description: 'Client' }
      )
      built_response = build_response_from_person(marge)
      stub_person_search('Ma', built_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content 'Client ID 123-456-789 in CWS-CMS'
      end
    end

    scenario 'person without phone_numbers' do
      stub_person_search('Ma', marge_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-phone'
      end
    end

    scenario 'person without addresses' do
      stub_person_search('Ma', marge_response)

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
        addresses: [address],
        legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
        sensitive: false,
        sealed: false
      )
      built_response = build_response_from_person(marge)
      stub_person_search('Ma', built_response)

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
        addresses: [address],
        legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
        sensitive: true,
        sealed: false
      )
      built_response = build_response_from_person(marge)
      stub_person_search('Ma', built_response)

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
        addresses: [address],
        legacy_descriptor: FactoryGirl.create(:legacy_descriptor),
        sensitive: false,
        sealed: true
      )
      built_response = build_response_from_person(marge)
      stub_person_search('Ma', built_response)

      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to have_content 'Sealed'
      end
    end

    scenario 'search displays no results when none are returned' do
      no_search_results = {
        hits: {
          total: 0,
          hits: []
        }
      }
      stub_person_search('No', no_search_results)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'No', skip_select: true
        expect(page).to have_content 'No results were found for "No"'
      end
    end

    scenario 'search displays the number of results in results header' do
      search_results = {
        hits: {
          total: 25,
          hits: [{
            _source: {
              race_ethnicity: {},
              addresses: [],
              gender: 'male',
              languages: [],
              date_of_birth: '1991-08-08',
              legacy_descriptor: {},
              last_name: 'Person',
              middle_name: 'Middle name',
              ssn: '',
              phone_numbers: [],
              id: 'Ca10L2205I',
              first_name: 'Random',
              sensitivity_indicator: 'N',
              sensitive: false,
              sealed: false,
              races: [],
              ethnicity: {},
              legacy_id: 'Ca10L2205I'
            }
          }]
        }
      }
      stub_person_search('So', search_results)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'So', skip_select: true
        expect(page).to have_content 'Showing 1-25 of 25 results for "So"'
      end
    end
  end
end
