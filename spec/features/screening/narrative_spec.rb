# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'screening narrative card' do
  scenario 'user edits narrative card from screening show page and cancels' do
    existing_screening = FactoryGirl.create(
      :screening,
      report_narrative: 'This is my report narrative'
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)
    click_link 'Edit narrative'

    within '#narrative-card.edit' do
      expect(page).to have_field('Report Narrative', with: 'This is my report narrative')
      fill_in 'Report Narrative', with: 'Trying to fill in'
      click_button 'Cancel'
    end

    within '#narrative-card.show' do
      expect(page).to have_content 'This is my report narrative'
    end

    click_link 'Edit narrative'

    within '#narrative-card.edit' do
      expect(page).to have_field('Report Narrative', with: 'This is my report narrative')
    end
  end

  scenario 'user edits narrative card from screening edit page and cancels' do
    existing_screening = FactoryGirl.create(
      :screening,
      report_narrative: 'This is my report narrative'
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    visit edit_screening_path(id: existing_screening.id)

    within '#narrative-card.edit' do
      expect(page).to have_field('Report Narrative', with: 'This is my report narrative')
      fill_in 'Report Narrative', with: 'Trying to fill in'
      click_button 'Cancel'
    end

    within '#narrative-card.show' do
      expect(page).to have_content 'This is my report narrative'
    end
  end

  scenario 'user edits narrative card from screening show page and saves' do
    existing_screening = FactoryGirl.create(
      :screening,
      report_narrative: 'This is my report narrative'
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)
    click_link 'Edit narrative'

    within '#narrative-card.edit' do
      expect(page).to have_field('Report Narrative', with: 'This is my report narrative')
      fill_in 'Report Narrative', with: 'Trying to fill in with changes'
    end

    existing_screening.report_narrative = 'Trying to fill in with changes'
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    within '#narrative-card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made
    stub_empty_relationships_for_screening(existing_screening)

    within '#narrative-card.show' do
      expect(page).to have_content 'Trying to fill in with changes'
    end
  end

  scenario 'user edits narrative card from screening edit page and saves' do
    existing_screening = FactoryGirl.create(
      :screening,
      report_narrative: 'This is my report narrative'
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    visit edit_screening_path(id: existing_screening.id)

    within '#narrative-card.edit' do
      expect(page).to have_field('Report Narrative', with: 'This is my report narrative')
      fill_in 'Report Narrative', with: 'Trying to fill in with changes'
    end

    existing_screening.report_narrative = 'Trying to fill in with changes'
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    within '#narrative-card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#narrative-card.show' do
      expect(page).to have_content 'Trying to fill in with changes'
    end
  end
end
