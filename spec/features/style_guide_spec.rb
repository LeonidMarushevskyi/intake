# frozen_string_literal: true
require 'rails_helper'

feature 'Style guide' do
  scenario 'styles are listed in sidebar' do
    visit style_guide_index_path

    expect(page).to have_title 'Casebook Intake Accelerator'
    expect(page).to have_content 'PATTERN LIBRARY'

    within 'nav' do
      expect(page).to have_link 'Tables'
      expect(page).to have_link 'Forms'
    end

    click_link 'Tables'
    expect(page).to have_css('h1', text: 'Tables')

    click_link 'Forms'
    expect(page).to have_content 'Forms'
  end
end
