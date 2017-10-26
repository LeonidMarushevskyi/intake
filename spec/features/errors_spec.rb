# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'error pages' do
  context 'page does not exist' do
    let(:dashboard_url) { 'http://fake_dashboard.ca.gov' }
    around do |example|
      Rails.application.config.consider_all_requests_local = false
      Rails.application.config.action_dispatch.show_exceptions = true
      example.run
      Rails.application.config.consider_all_requests_local = true
      Rails.application.config.action_dispatch.show_exceptions = false
    end

    scenario 'renders 404 page' do
      pending(
        'implemented but untestable in parallel. (selenium thread w/out config changes)'
      )
      allow(Rails.configuration).to receive(:intake).and_return(dashboard_url: dashboard_url)
      visit '/this_page_does_not_exist'
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard', href: dashboard_url)
    end
  end
end
