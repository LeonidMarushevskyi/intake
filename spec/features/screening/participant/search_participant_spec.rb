# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'feature/testing'
feature 'searching a participant in autocompleter' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:date_of_birth) { 15.years.ago.to_date }
  before do
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)
    stub_system_codes
    visit edit_screening_path(id: existing_screening.id)
  end

  context 'search for a person' do
    scenario 'search result contains person information' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_middle_name('Jacqueline')
              builder.with_last_name('Simpson')
              builder.with_name_suffix('md')
              builder.with_gender('female')
              builder.with_dob(date_of_birth)
              builder.with_ssn('123231234')
              builder.with_languages do
                [
                  LanguageSearchResultBuilder.build('French') do |language|
                    language.with_primary true
                  end,
                  LanguageSearchResultBuilder.build('Italian')
                ]
              end
              builder.with_phone_number(number: '971-287-6774', type: 'Home')
              builder.with_addresses([{
                                       street_number: '123',
                                       street_name: 'Fake St',
                                       state_code: 'NY',
                                       city: 'Springfield',
                                       zip: '11222',
                                       type: ''
                                     }])
              builder.with_race_and_ethnicity do
                RaceEthnicitySearchResultBuilder.build do |race_ethnicity|
                  race_ethnicity.with_hispanic_origin_code('Y')
                  race_ethnicity.with_hispanic_unable_to_determine_code('')
                  race_ethnicity.with_race_codes do
                    [
                      RaceCodesSearchResultBuilder.build('White'),
                      RaceCodesSearchResultBuilder.build('American Indian or Alaska Native')
                    ]
                  end
                end
              end
              builder.with_sensitivity
              builder.with_sort('1')
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)

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
        expect(page).to have_content '123 Fake St, Springfield, NY 11222'
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'search results format the SSN' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_ssn('123456789')
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma 12345', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person',
          with: 'Ma 123-45',
          select_option_with: 'Marge'
      end

      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content '123-45-6789'
      end

      expect(
        a_request(
          :post,
          dora_api_url(Rails.application.routes.url_helpers.dora_people_light_index_path)
        ).with('body' => {
                 'query' => {
                   'bool' => {
                     'must' => array_including(
                       'multi_match' => hash_including('query' => 'ma 12345')
                     )
                   }
                 },
                 '_source' => anything,
                 'highlight' => anything,
                 'track_scores' => anything,
                 'sort' => anything,
                 'size' => anything
               })
      ).to have_been_made
    end

    scenario 'results include information about the legacy source information for a person' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_legacy_descriptor(
                legacy_ui_id: '123-456-789',
                legacy_table_description: 'Client'
              )
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within '.react-autosuggest__suggestions-list' do
        expect(page).to have_content 'Client ID 123-456-789 in CWS-CMS'
      end
    end

    scenario 'person without phone_numbers' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_middle_name('Jacqueline')
              builder.with_last_name('Simpson')
              builder.with_name_suffix('md')
              builder.with_phone_number({})
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-phone'
      end
    end

    scenario 'person without addresses' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_middle_name('Jacqueline')
              builder.with_last_name('Simpson')
              builder.with_name_suffix('md')
              builder.with_addresses({})
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within 'li', text: 'Marge Jacqueline Simpson MD' do
        expect(page).to_not have_css 'fa-map-marker'
      end
    end

    scenario 'person who is neither sensitive nor sealed' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.without_sealed_or_sensitive
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sensitive' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_sensitivity
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end
      within 'li', text: 'Marge' do
        expect(page).to have_content 'Sensitive'
        expect(page).to_not have_content 'Sealed'
      end
    end

    scenario 'person who is sealed' do
      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
              builder.with_sealed
            end
          ]
        end
      end
      stub_person_search(search_term: 'Ma', person_response: search_response)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Ma'
      end

      within 'li', text: 'Marge' do
        expect(page).to_not have_content 'Sensitive'
        expect(page).to have_content 'Sealed'
      end
    end

    scenario 'search displays no results when none are returned' do
      no_search_results = PersonSearchResponseBuilder.build do |builder|
        builder.with_total(0)
        builder.with_hits { [] }
      end
      stub_person_search(search_term: 'No', person_response: no_search_results)
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'No', skip_select: true
        expect(page).to have_content 'No results were found for "No"'
      end
    end

    scenario 'person search supports pagination' do
      search_results_one = PersonSearchResponseBuilder.build do |builder|
        builder.with_total(51)
        builder.with_hits do
          Array.new(25) do |index|
            PersonSearchResultBuilder.build do |result|
              result.with_first_name("Result #{index}")
              result.with_sort(["result_#{index}_score", "result_#{index}_uuid"])
            end
          end
        end
      end
      search_results_two = PersonSearchResponseBuilder.build do |builder|
        builder.with_total(51)
        builder.with_hits do
          Array.new(25) do |index|
            PersonSearchResultBuilder.build do |result|
              result.with_first_name("Result #{index + 25}")
              result.with_sort(["result_#{index + 25}_score", "result_#{index + 25}_uuid"])
            end
          end
        end
      end
      search_results_three = PersonSearchResponseBuilder.build do |builder|
        builder.with_total(51)
        builder.with_hits do
          [
            PersonSearchResultBuilder.build do |result|
              result.with_first_name('Result 50')
              result.with_sort(%w[result_50_score result_50_uuid])
            end
          ]
        end
      end
      stub_person_search(search_term: 'Fi', person_response: search_results_one)
      stub_person_search(
        search_term: 'Fi',
        person_response: search_results_two,
        search_after: %w[result_24_score result_24_uuid]
      )
      stub_person_search(
        search_term: 'Fi',
        person_response: search_results_three,
        search_after: %w[result_49_score result_49_uuid]
      )
      search_path = dora_api_url(
        Rails.application.routes.url_helpers.dora_people_light_index_path
      )
      within '#search-card', text: 'Search' do
        fill_in_autocompleter 'Search for any person', with: 'Fi', skip_select: true, split: true
        expect(page).to have_content 'Showing 1-25 of 51 results for "Fi"'
        expect(page).to have_content 'Result 24'
      end
      expect(a_request(:post, search_path)).to have_been_made

      within '#search-card', text: 'Search' do
        click_button 'Show more results'
      end
      within '#search-card', text: 'Search' do
        expect(page).to have_content 'Showing 1-50 of 51 results for "Fi"'
        expect(page).to have_content 'Result 49'
      end
      expect(
        a_request(:post, search_path)
        .with(body: hash_including('search_after' => %w[result_24_score result_24_uuid]))
      ).to have_been_made

      within '#search-card', text: 'Search' do
        click_button 'Show more results'
      end
      within '#search-card', text: 'Search' do
        expect(page).to have_content 'Showing 1-51 of 51 results for "Fi"'
        expect(page).to have_content 'Result 50'
      end
      expect(
        a_request(:post, search_path)
        .with(body: hash_including('search_after' => %w[result_49_score result_49_uuid]))
      ).to have_been_made

      within '#search-card', text: 'Search' do
        expect(page).to_not have_button('Show more results')
      end
    end
  end
end
