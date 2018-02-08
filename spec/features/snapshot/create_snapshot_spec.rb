# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create Snapshot' do
  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
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

      expect(page).not_to have_css('.side-bar')
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

  context 'when release two is not enabled' do
    around do |example|
      Feature.run_with_deactivated(:release_two) do
        example.run
      end
    end

    scenario 'snapshot page is not accessible' do
      visit snapshot_path
      expect(page).to have_content('Sorry, this is not the page you want')
    end
  end
end
