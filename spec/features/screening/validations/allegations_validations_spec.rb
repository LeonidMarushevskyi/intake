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
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_relationships_by_screening_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    error_message = 'must include at least one allegation'

    within '#allegations-card.edit' do
      expect(page).to have_content(error_message)
      click_button 'Cancel'
    end

    within '#allegations-card.show' do
      expect(page).to have_content(error_message)
      click_link 'Edit'
    end

    within '#allegations-card.edit' do
      fill_in_react_select "allegations_#{victim.id}_#{perpetrator.id}", with: 'General neglect'
      expect(page).not_to have_content(error_message)
      remove_react_select_option "allegations_#{victim.id}_#{perpetrator.id}", 'General neglect'
      expect(page).to have_content(error_message)
    end

    within '#decision-card.edit' do
      select '', from: 'Screening Decision'
    end

    within '#allegations-card.edit' do
      expect(page).not_to have_content(error_message)
      click_button 'Cancel'
    end

    within '#allegations-card.show' do
      expect(page).not_to have_content(error_message)
    end
  end
end
