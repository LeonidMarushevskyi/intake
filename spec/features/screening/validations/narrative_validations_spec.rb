# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Narrative Card Validations' do
  let(:screening) { FactoryGirl.create(:screening, report_narrative: '') }
  let(:error_message) { 'Please enter a narrative.' }

  context 'on the edit page' do
    before do
      stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))
      stub_empty_relationships_for_screening(screening)
      stub_empty_history_for_screening(screening)

      visit edit_screening_path(id: screening.id)

      # TODO: remove this once we can consistently have a fresh page for these specs
      page.driver.browser.navigate.refresh
    end

    scenario 'displays no error on initial load' do
      should_not_have_content error_message, inside: '#narrative-card.edit'
    end

    scenario 'displays error on blur' do
      within '#narrative-card.edit' do
        fill_in 'Report Narrative', with: ''
      end
      blur_field
      should_have_content error_message, inside: '#narrative-card.edit'
    end

    scenario 'removes error on change' do
      within '#narrative-card.edit' do
        fill_in 'Report Narrative', with: ''
      end
      blur_field
      should_have_content error_message, inside: '#narrative-card.edit'
      within '#narrative-card.edit' do
        fill_in 'Report Narrative', with: 'This stuff happend when I talked to him.'
      end
      should_not_have_content error_message, inside: '#narrative-card.edit'
    end

    scenario 'shows error on save page' do
      within '#narrative-card.edit' do
        fill_in 'Report Narrative', with: ''
      end
      blur_field
      should_have_content error_message, inside: '#narrative-card.edit'
      save_card('narrative')
      should_have_content error_message, inside: '#narrative-card .card-body'
    end

    scenario 'shows no error when filled in' do
      within '#narrative-card.edit' do
        fill_in 'Report Narrative', with: 'This has been filled in.'
      end
      blur_field
      should_not_have_content error_message, inside: '#narrative-card .card-body'
      stub_screening_put_request_with_anything_and_return(
        screening,
        with_updated_attributes: { report_narrative: 'This has been filled in.' }
      )
      save_card('narrative')
      should_not_have_content error_message, inside: '#narrative-card .card-body'
    end
  end
end
