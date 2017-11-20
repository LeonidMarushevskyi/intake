# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'worker safety card' do
  scenario 'user edits worker safety card from screening show page and cancels' do
    existing_screening = FactoryGirl.create(
      :screening,
      safety_information: 'Important safety stuff',
      safety_alerts: ['Dangerous Environment']
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)
    click_link 'Edit worker safety'

    within '#worker-safety-card.edit' do
      expect(page).to have_field('Additional safety information', with: 'Important safety stuff')
      expect(page).to have_react_select_field(
        'Worker safety alerts', with: ['Dangerous Environment']
      )
      fill_in 'Additional safety information', with: 'Something else'
      fill_in_react_select 'Worker safety alerts', with: ['Firearms in Home']
      click_button 'Cancel'
    end

    within '#worker-safety-card.show' do
      expect(page).to have_content 'Important safety stuff'
      expect(page).to have_content 'Dangerous Environment'
      expect(page).not_to have_content 'Firearms in Home'
    end

    click_link 'Edit worker safety'

    within '#worker-safety-card.edit' do
      expect(page).to have_field('Additional safety information', with: 'Important safety stuff')
    end
  end

  scenario 'user edits worker safety card from screening edit page and cancels' do
    existing_screening = FactoryGirl.create(
      :screening,
      safety_information: 'Important safety stuff',
      safety_alerts: ['Dangerous Environment']
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    visit edit_screening_path(id: existing_screening.id)

    within '#worker-safety-card.edit' do
      expect(page).to have_field('Additional safety information', with: 'Important safety stuff')
      expect(page).to have_react_select_field(
        'Worker safety alerts', with: ['Dangerous Environment']
      )
      fill_in 'Additional safety information', with: 'Something else'
      fill_in_react_select 'Worker safety alerts', with: ['Firearms in Home']
      click_button 'Cancel'
    end

    within '#worker-safety-card.show' do
      expect(page).to have_content 'Important safety stuff'
      expect(page).to have_content 'Dangerous Environment'
      expect(page).not_to have_content 'Firearms in Home'
    end
  end

  scenario 'user edits worker safety card from screening show page and saves' do
    existing_screening = FactoryGirl.create(
      :screening,
      safety_information: 'Important safety stuff',
      safety_alerts: ['Dangerous Environment']
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)
    stub_empty_history_for_screening(existing_screening)

    visit screening_path(id: existing_screening.id)
    click_link 'Edit worker safety'

    within '#worker-safety-card.edit' do
      expect(page).to have_field('Additional safety information', with: 'Important safety stuff')
      expect(page).to have_react_select_field(
        'Worker safety alerts', with: ['Dangerous Environment']
      )
      fill_in 'Additional safety information', with: 'Something else'
      fill_in_react_select 'Worker safety alerts', with: ['Firearms in Home']
    end

    existing_screening.safety_information = 'Something else'
    existing_screening.safety_alerts = ['Dangerous Environment', 'Firearms in Home']
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    within '#worker-safety-card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#worker-safety-card.show' do
      expect(page).to have_content 'Something else'
      expect(page).to have_content 'Dangerous Environment'
      expect(page).to have_content 'Firearms in Home'
    end
  end

  scenario 'user edits worker safety card from screening edit page and saves' do
    existing_screening = FactoryGirl.create(
      :screening,
      safety_information: 'Important safety stuff',
      safety_alerts: ['Dangerous Environment']
    )
    stub_request(
      :get, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    visit edit_screening_path(id: existing_screening.id)

    within '#worker-safety-card.edit' do
      expect(page).to have_field('Additional safety information', with: 'Important safety stuff')
      expect(page).to have_react_select_field(
        'Worker safety alerts', with: ['Dangerous Environment']
      )
      fill_in 'Additional safety information', with: 'Something else'
      fill_in_react_select 'Worker safety alerts', with: ['Firearms in Home']
      fill_in_react_select 'Worker safety alerts',
        with: ['Severe Mental Health Status'], exit_key: :tab
    end

    existing_screening.safety_information = 'Something else'
    existing_screening.safety_alerts = ['Dangerous Environment', 'Firearms in Home']
    stub_request(
      :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
    ).with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    stub_empty_relationships_for_screening(existing_screening)

    within '#worker-safety-card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(
        :put, intake_api_url(ExternalRoutes.intake_api_screening_path(existing_screening.id))
      ).with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#worker-safety-card.show' do
      expect(page).to have_content 'Something else'
      expect(page).to have_content 'Dangerous Environment'
      expect(page).to have_content 'Firearms in Home'
    end
  end
end
