# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'screening information card' do
  let(:screening) do
    FactoryGirl.create(
      :screening,
      name: 'James',
      assignee: 'Lisa',
      started_at: '2016-08-13T10:00:00.000Z',
      ended_at: '2016-08-15T11:00:00.000Z',
      communication_method: 'mail'
    )
  end

  before(:each) do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)
    visit edit_screening_path(id: screening.id)
  end

  scenario 'user edits screening details and save the card' do
    within '#screening-information-card.edit' do
      expect(page).to have_field('Title/Name of Screening', with: 'James')
      expect(page).to have_field('Assigned Social Worker', with: 'Lisa')
      expect(page).to have_field('Screening Start Date/Time', with: '08/13/2016 3:00 AM')
      expect(page).to have_field('Screening End Date/Time', with: '08/15/2016 4:00 AM')
      expect(page).to have_field('Communication Method', with: 'mail')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
    end

    within '#screening-information-card.edit' do
      fill_in_datepicker 'Screening Start Date/Time', with: '08/15/2016 3:00 AM'
      fill_in_datepicker 'Screening End Date/Time', with: '08/17/2016 3:00 AM'
      fill_in 'Title/Name of Screening', with: 'Cameron'
      fill_in 'Assigned Social Worker', with: 'Mariko'
      select 'Phone', from: 'Communication Method'
      click_button 'Save'
    end

    screening.assign_attributes(
      name: 'Cameron',
      assignee: 'Mariko',
      communication_method: 'phone',
      started_at: '2016-08-15T10:00:00.000Z',
      ended_at: '2016-08-17T10:00:00.000Z'
    )

    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening)))
      .and_return(json_body(screening.to_json))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)

    expect(
      a_request(:put, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .with(json_body(as_json_without_root_id(screening)))
    ).to have_been_made
  end

  scenario 'user edits information details and click cancel' do
    within '#screening-information-card.edit' do
      fill_in 'Title/Name of Screening', with: 'Bob Loblaw'
      fill_in 'Assigned Social Worker', with: 'George Michael'
      select 'In Person', from: 'Communication Method'
      fill_in_datepicker 'Screening Start Date/Time', with: '08/19/2016 3:00 AM'
      fill_in_datepicker 'Screening End Date/Time', with: '08/24/2016 3:00 AM'
      click_button 'Cancel'
    end

    within '#screening-information-card.show' do
      expect(page).to have_content('James')
      expect(page).to have_content('Lisa')
      expect(page).to have_content('08/13/2016 3:00 AM')
      expect(page).to have_content('08/15/2016 4:00 AM')
      expect(page).to have_content('Mail')
    end

    # And the cancel effect is persistent
    click_link 'Edit screening information'
    within '#screening-information-card.edit' do
      expect(page).to have_field('Title/Name of Screening', with: 'James')
      expect(page).to have_field('Assigned Social Worker', with: 'Lisa')
      expect(page).to have_field('Screening Start Date/Time', with: '08/13/2016 3:00 AM')
      expect(page).to have_field('Screening End Date/Time', with: '08/15/2016 4:00 AM')
      expect(page).to have_field('Communication Method', with: 'mail')
    end

    within '#screening-information-card.edit' do
      select_time_from_timepicker('#started_at', '3:30 PM')
      expect(page).to have_field('Screening Start Date/Time', with: '08/13/2016 3:30 PM')
    end
  end
end
