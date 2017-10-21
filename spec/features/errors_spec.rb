# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'error pages' do
  context 'page does not exist' do
    around do |example|
      Rails.application.config.consider_all_requests_local = false
      Rails.application.config.action_dispatch.show_exceptions = true
      load 'application_controller.rb'
      example.run
      Rails.application.config.consider_all_requests_local = true
      Rails.application.config.action_dispatch.show_exceptions = false
      load 'application_controller.rb'
    end

    scenario 'renders 404 page' do
      visit page_path('this_page_does_not_exist')
      expect(page).to have_text('Sorry, this is not the page you want.')
      expect(page).to have_text(
        "It may have been deleted or doesn't exist. Please check the address or"
      )
      expect(page).to have_link('return to your dashboard')
    end
  end
end
