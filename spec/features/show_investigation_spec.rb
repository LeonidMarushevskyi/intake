# frozen_string_literal: true

require 'rails_helper'

feature 'Show Investigation' do
  scenario 'user navigates to the investigation show page' do
    visit investigation_path(id: '12345')
    within '.card.show' do
      expect(page).to have_content 'Screening Summary'
    end
  end
end
