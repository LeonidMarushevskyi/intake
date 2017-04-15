# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'History card' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'edit an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit edit_screening_path(id: existing_screening.id)

    within '#history-card.card.show.card', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end

  scenario 'view an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit screening_path(id: existing_screening.id)

    within '#history-card.card.show', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end
end
