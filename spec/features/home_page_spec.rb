# frozen_string_literal: true
require 'rails_helper'

feature 'home page' do
  scenario 'includes title and navigation links' do
    visit root_path

    expect(page).to have_title 'Casebook Intake Accelerator'
    expect(page).to have_link 'Create Referral'
    expect(page).to have_link 'Create Person'
    expect(page).to have_link 'Referrals'
  end
end
