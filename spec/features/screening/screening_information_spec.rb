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
    stub_request(:get, api_screening_path(screening.id))
      .and_return(body: screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: screening.id)
  end

  scenario 'user edits screening details and save the card' do
    within '#screening-information-card.edit' do
      expect(page).to have_field('Title/Name of Screening', with: 'James')
      expect(page).to have_field('Assigned Social Worker', with: 'Lisa')
      expect(page).to have_field('Screening Start Date/Time', with: '2016-08-13T10:00:00.000Z')
      expect(page).to have_field('Screening End Date/Time', with: '2016-08-15T11:00:00.000Z')
      expect(page).to have_field('Communication Method', with: 'mail')
      expect(page).to have_content('Save')
      expect(page).to have_content('Cancel')
      fill_in 'Title/Name of Screening', with: 'Cameron'
      fill_in 'Assigned Social Worker', with: 'Mariko'
      select 'Phone', from: 'Communication Method'
      fill_in 'Screening End Date/Time', with: '2016-08-17T10:00:00.000Z'
      click_button 'Save'
    end

    screening.assign_attributes(
      name: 'Cameron',
      assignee: 'Mariko',
      communication_method: 'phone',
      ended_at: '2016-08-17T10:00:00.000Z'
    )

    stub_request(:put, api_screening_path(screening.id))
      .with(json_body(screening.to_json(except: :id)))
      .and_return(json_body(screening.to_json))

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(json_body(screening.to_json(except: :id)))
    ).to have_been_made
  end

  scenario 'user edits information details and click cancel' do
    within '#screening-information-card.edit' do
      fill_in 'Title/Name of Screening', with: 'Bob Loblaw'
      fill_in 'Assigned Social Worker', with: 'George Michael'
      select 'Online', from: 'Communication Method'
      fill_in 'Screening Start Date/Time', with: '2016-08-19T10:00:00.000Z'
      fill_in 'Screening End Date/Time', with: '2016-08-24T10:00:00.000Z'
      click_button 'Cancel'
    end

    within '#screening-information-card.show' do
      expect(page).to have_content('James')
      expect(page).to have_content('Lisa')
      expect(page).to have_content('08/13/2016 10:00 AM')
      expect(page).to have_content('08/15/2016 11:00 AM')
      expect(page).to have_content('Mail')
    end

    # And the cancel effect is persistent
    click_link 'Edit screening information'
    within '#screening-information-card.edit' do
      expect(page).to have_field('Title/Name of Screening', with: 'James')
      expect(page).to have_field('Assigned Social Worker', with: 'Lisa')
      expect(page).to have_field('Screening Start Date/Time', with: '2016-08-13T10:00:00.000Z')
      expect(page).to have_field('Screening End Date/Time', with: '2016-08-15T11:00:00.000Z')
      expect(page).to have_field('Communication Method', with: 'mail')
    end
  end
end
