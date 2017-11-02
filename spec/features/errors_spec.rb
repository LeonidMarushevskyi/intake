# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'error pages' do
  around do |example|
    Rails.application.config.consider_all_requests_local = false
    Rails.application.config.action_dispatch.show_exceptions = true
    example.run
    Rails.application.config.consider_all_requests_local = true
    Rails.application.config.action_dispatch.show_exceptions = false
  end

  context 'page does not exist' do
    let(:dashboard_url) { 'http://fake_dashboard.ca.gov' }

    scenario 'renders 404 page' do
      if ENV.key?('TEST_ENV_NUMBER')
        skip 'Pending as this test fails during parallel runs'
      end
      allow(Rails.configuration).to receive(:intake).and_return(dashboard_url: dashboard_url)
      visit '/this_page_does_not_exist'
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: dashboard_url)
    end
  end

  context 'server has error' do
    scenario 'renders 500 page' do
      pending 'implemented but fails because react recovers'
      stub_request(:get, '/screenings/2').and_return(json_body('I failed', status: 500))
      visit '/screenings/2'

      expect(page).to have_text('Sorry, something went wrong.')
      expect(page).to have_text(
        "It's nothing you did. Due to an entirely internal error, "\
        'your request could not be completred. Please try refreshing the page.'
      )
    end
  end
end

feature 'error banner' do
  let(:screening) { FactoryGirl.create(:screening) }
  context 'error occurred after page was loaded' do
    around do |example|
      stub_request(
        :get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id))
      ).and_return(json_body(screening.to_json, status: 200))
      stub_empty_relationships_for_screening(screening)
      stub_empty_history_for_screening(screening)
      Feature.run_with_activated(:referral_submit) do
        example.run
      end
    end

    scenario 'hide the error banner after a successful action' do
      stub_request(
        :post,
        intake_api_url(ExternalRoutes.intake_api_screening_submit_path(screening.id))
      ).and_return(json_body([].to_json, status: 500))
      visit edit_screening_path(id: screening.id)
      expect(page).to_not have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
      click_button 'Submit'
      expect(page).to have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
      stub_request(
        :post,
        intake_api_url(ExternalRoutes.intake_api_screening_submit_path(screening.id))
      ).and_return(json_body([].to_json, status: 200))
      click_button 'Submit'
      expect(page).to_not have_text(
        'Something went wrong, sorry! Please try your last action again.'
      )
    end
  end
end
