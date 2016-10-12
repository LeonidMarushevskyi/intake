# frozen_string_literal: true
require 'rails_helper'

feature 'home page' do
  scenario 'includes title and navigation links' do
    visit root_path

    expect(page).to have_title 'Intake'
    expect(page).to have_link 'Start Screening'
    expect(page).to have_link 'Create Person'
    expect(page).to have_link 'Screenings'
  end
end
