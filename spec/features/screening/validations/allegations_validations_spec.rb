# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Allegations Validations' do
  scenario 'User sees that allegations are required when decision is promote to referral' do
    perpetrator = FactoryGirl.create(:participant, :perpetrator)
    victim = FactoryGirl.create(:participant, :victim)
    screening = FactoryGirl.create(
      :screening,
      participants: [perpetrator, victim],
      screening_decision: 'promote_to_referral'
    )
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: victim.id,
      perpetrator_id: perpetrator.id,
      screening_id: screening.id
    )
    screening.allegations << allegation
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)

    visit edit_screening_path(id: screening.id)

    error_message = 'must include at least one allegation'

    within '.card.edit', text: 'Allegations' do
      expect(page).to have_content(error_message)
      click_button 'Cancel'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).to have_content(error_message)
      click_link 'Edit'
    end

    within '.card.edit', text: 'Allegations' do
      fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
      expect(page).not_to have_content(error_message)
      remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
      expect(page).to have_content(error_message)
    end

    within '#decision-card.edit' do
      select '', from: 'Screening decision'
    end

    within '.card.edit', text: 'Allegations' do
      expect(page).not_to have_content(error_message)
      click_button 'Cancel'
    end

    within '.card.show', text: 'Allegations' do
      expect(page).not_to have_content(error_message)
    end
  end
end
