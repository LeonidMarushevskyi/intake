# frozen_string_literal: true

require 'rails_helper'

feature 'Create Investigation Contact' do
  scenario 'user can see new contacts page' do
    investigation_id = '123ABC'
    visit new_investigation_contact_path(investigation_id: investigation_id)
    within 'h1' do
      expect(page).to have_content("New Contact - Investigation #{investigation_id}")
    end
  end
end
