# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'routing errors' do
  around do |example|
    raise_server_errors = Capybara.raise_server_errors
    Capybara.raise_server_errors = false
    example.run
    Capybara.raise_server_errors = raise_server_errors
  end

  context 'when investigations is disabled' do
    around do |example|
      Feature.run_with_deactivated(:investigations) do
        example.run
      end
    end

    scenario 'view an existing investigation returns 404', browser: :poltergeist do
      investigation_id = '12345'
      visit investigation_path(id: investigation_id)
      expect(
        a_request(
          :get,
          intake_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
        )
      ).not_to have_been_made
      expect(page.status_code).not_to eq 200
    end
  end

  context 'user logs out when there is a base_path configured' do
    let(:base_path) { 'intake' }

    around do |example|
      with_config(base_path: base_path) do
        example.run
      end
    end

    scenario 'when user logs out', browser: :poltergeist do
      visit root_path(accessCode: 'tempToken123')
      # regular click_link won't keep the pop-up menu open for some reason
      execute_script('$(".fa.fa-user").click()')
      click_link 'Logout'
      expect(page.current_url).to have_content 'intake/logout'
    end
  end

  context 'when release two is enabled' do
    let(:screening_id) { '1234' }

    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'edit screening route does not exist', browser: :poltergeist do
      visit edit_screening_path(id: screening_id)
      expect(a_request(:get, api_v1_screening_path(screening_id))).not_to have_been_made
      expect(page.status_code).not_to eq 200
    end

    scenario 'view an existing screening route does not exist', browser: :poltergeist do
      visit screening_path(id: screening_id)
      expect(a_request(:get, api_v1_screening_path(screening_id))).not_to have_been_made
      expect(page.status_code).not_to eq 200
    end
  end

  context 'when release two is not enabled' do
    around do |example|
      Feature.run_with_deactivated(:release_two) do
        example.run
      end
    end

    scenario 'snapshot page is not accessible', browser: :poltergeist do
      visit snapshot_path
      expect(a_request(:post, api_v1_screenings_path)).not_to have_been_made
      expect(page.status_code).not_to eq 200
    end
  end
end
