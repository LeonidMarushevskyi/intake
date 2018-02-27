# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create Snapshot' do
  context 'when only snapshot is enabled' do
    around do |example|
      Feature.run_with_deactivated(:screenings) do
        example.run
      end
    end

    let(:new_snapshot) do
      FactoryGirl.create(
        :screening,
        indexable: false,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: { city: nil },
        assignee: nil
      )
    end

    before do
      allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    end

    scenario 'via start snapshot link' do
      stub_empty_history_for_screening(new_snapshot)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .with(body: as_json_without_root_id(new_snapshot))
        .and_return(json_body(new_snapshot.to_json, status: 201))

      visit root_path
      click_button 'Start Snapshot'

      expect(
        a_request(
          :post, intake_api_url(ExternalRoutes.intake_api_screenings_path)
        ).with(body: as_json_without_root_id(new_snapshot))
      ).to have_been_made

      expect(page.current_url).to match 'snapshot'

      within '#snapshot-card' do
        expect(page).to have_content(
          'The Child Welfare History Snapshot allows you to search CWS/CMS for people and their'
        )
      end

      expect(page).to have_css('.side-bar')
      expect(page).to have_content('People & Roles')
      expect(page).to have_content('Relationships')
      expect(page).to have_content('History')
    end

    scenario 'user starts a snapshot, goes back to the home page, and starts another snapshot' do
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(new_snapshot.to_json, status: 201))

      visit root_path
      click_button 'Start Snapshot'

      stub_empty_relationships_for_screening(new_snapshot)
      stub_empty_history_for_screening(new_snapshot)
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
      person = FactoryGirl.create(:participant, first_name: 'Marge', screening_id: new_snapshot.id)
      stub_request(
        :post,
        intake_api_url(ExternalRoutes.intake_api_screening_people_path(new_snapshot.id))
      ).and_return(json_body(person.to_json, status: 201))

      within '#search-card', text: 'Search' do
        fill_in 'Search for clients', with: 'Ma'
        page.find('strong', text: 'Marge').click
      end

      within show_participant_card_selector(person.id) do
        within '.card-body' do
          expect(page).to have_content(person.first_name)
        end
      end

      page.driver.go_back

      other_snapshot = FactoryGirl.create(
        :screening,
        indexable: false,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: { city: nil },
        assignee: nil
      )
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(other_snapshot.to_json, status: 201))
      click_button 'Start Snapshot'

      expect(page).not_to have_css show_participant_card_selector(person.id)
    end

    scenario 'a new snapshot is created if the user visits the snapshot page directly' do
      stub_empty_history_for_screening(new_snapshot)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .with(body: as_json_without_root_id(new_snapshot))
        .and_return(json_body(new_snapshot.to_json, status: 201))

      visit snapshot_path
      expect(page).to have_content('The Child Welfare History Snapshot allows you to search')

      expect(
        a_request(
          :post, intake_api_url(ExternalRoutes.intake_api_screenings_path)
        ).with(body: as_json_without_root_id(new_snapshot))
      ).to have_been_made
      expect(
        a_request(
          :get,
          ferb_api_url(
            ExternalRoutes.ferb_api_screening_history_of_involvements_path(new_snapshot.id)
          )
        )
      ).not_to have_been_made
    end

    scenario 'user creates a new snapshot by clicking the Start Over button' do
      stub_empty_history_for_screening(new_snapshot)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(new_snapshot.to_json, status: 201))

      visit snapshot_path
      expect(page).to have_content('The Child Welfare History Snapshot allows you to search')

      second_snapshot = FactoryGirl.create(:screening)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(second_snapshot.to_json, status: 201))

      click_button 'Start Over'

      expect(
        a_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      ).to have_been_made.times(2)
      expect(
        a_request(
          :get,
          ferb_api_url(
            ExternalRoutes.ferb_api_screening_history_of_involvements_path(second_snapshot.id)
          )
        )
      ).not_to have_been_made
    end
  end

  context 'when snapshot is not enabled' do
    around do |example|
      Feature.run_with_deactivated(:snapshot) do
        example.run
      end
    end

    scenario 'snapshot page is not accessible' do
      visit snapshot_path
      expect(page).to have_content('Sorry, this is not the page you want')
    end
  end

  context 'both snapshot and screening are enabled' do
    let(:new_screening) do
      FactoryGirl.create(
        :screening,
        indexable: true,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: { city: nil },
        assignee: nil
      )
    end

    let(:new_snapshot) do
      FactoryGirl.create(
        :screening,
        indexable: false,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: { city: nil },
        assignee: nil
      )
    end

    before do
      allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    end

    scenario 'user starts a screening, goes back to the home page, and starts a snapshot' do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screenings_path)).and_return(
        json_body([], status: 200)
      )
      visit root_path

      stub_empty_history_for_screening(new_screening)
      stub_empty_relationships_for_screening(new_screening)
      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(new_screening.to_json, status: 201))
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(new_screening.id))
      ).and_return(json_body(new_screening.to_json, status: 200))
      click_button 'Start Screening'

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
      person = FactoryGirl.create(:participant, first_name: 'Marge', screening_id: new_screening.id)
      stub_request(
        :post,
        intake_api_url(ExternalRoutes.intake_api_screening_people_path(new_screening.id))
      ).and_return(json_body(person.to_json, status: 201))

      within '#search-card', text: 'Search' do
        fill_in 'Search for any person', with: 'Ma'
        page.find('strong', text: 'Marge').click
      end

      within edit_participant_card_selector(person.id) do
        within '.card-header' do
          expect(page).to have_content(person.first_name)
        end
      end

      page.driver.go_back

      stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
        .and_return(json_body(new_snapshot.to_json, status: 201))
      click_button 'Start Snapshot'

      within '#snapshot-card' do
        expect(page).to have_content(
          'The Child Welfare History Snapshot allows you to search CWS/CMS for people and their'
        )
      end
      expect(page).not_to have_css show_participant_card_selector(person.id)
    end
  end
end
