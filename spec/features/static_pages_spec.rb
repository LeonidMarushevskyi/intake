# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'static pages' do
  scenario 'user should see privacy policy page' do
    visit '/pages/privacy_policy'

    expect(page).to have_text('CWDS Privacy')
  end

  scenario 'user should see conditions of use page' do
    visit '/pages/conditions_of_use'
    expect(page).to have_text('Conditions of Use')
  end
end
