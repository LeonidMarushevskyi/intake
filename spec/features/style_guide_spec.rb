# frozen_string_literal: true
require 'rails_helper'

feature 'Style guide' do
  scenario 'styles are listed in sidebar' do
    visit style_guide_index_path

    expect(page).to have_content 'Style guide index page'

    within 'nav' do
      expect(page).to have_link 'Lists'
      expect(page).to have_link 'Forms'
    end

    click_link 'Lists'
    expect(page).to have_content 'Lists page'

    click_link 'Forms'
    expect(page).to have_content 'Forms page'
  end
end
