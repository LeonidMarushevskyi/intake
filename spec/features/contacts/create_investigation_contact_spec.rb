# frozen_string_literal: true

require 'rails_helper'

feature 'Create Investigation Contact' do
  let(:investigation_id) { '123ABC' }

  before do
    people = [
      { first_name: 'Emma', last_name: 'Woodhouse' },
      { first_name: 'George', last_name: 'Knightley' }
    ]
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigations_people(investigation_id))
    ).and_return(json_body(people.to_json, status: 200))
    visit new_investigation_contact_path(investigation_id: investigation_id)
  end

  scenario 'user can add new contact' do
    within '.card-header' do
      expect(page).to have_content("New Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
      select 'Attempted', from: 'Status'
      select 'In person', from: 'Communication Method'
      select 'School', from: 'Location'
      select 'Investigate Referral', from: 'Purpose'
      fill_in 'Contact Notes', with: 'This was an attempted contact'
    end
    expect(page).to have_field('Date/Time', with: '08/17/2016 3:00 AM')
    expect(page).to have_select('Communication Method', selected: 'In person')
    expect(page).to have_content('Emma Woodhouse')
    expect(page).to have_content('George Knightley')
    expect(page).to have_select('Location', selected: 'School')
    expect(page).to have_select('Status', selected: 'Attempted')
    expect(page).to have_field('Contact Notes', with: 'This was an attempted contact')
    expect(page).to have_select('Purpose', selected: 'Investigate Referral')

    stub_request(:post, ferb_api_url(ExternalRoutes.ferb_api_investigations_contacts('123ABC')))
      .and_return(
        json_body(
          {
            id: 123,
            started_at: '2016-08-17T10:00:00.000Z',
            status: 'A',
            note: 'This was an attempted contact',
            purpose: '1',
            communication_method: 'ABC',
            location: '123'
          }.to_json,
          status: 201
        )
      )
    click_button 'Save'
    expect(
      a_request(:post, ferb_api_url(ExternalRoutes.ferb_api_investigations_contacts('123ABC')))
      .with(
        body: {
          started_at: '2016-08-17T10:00:00.000Z',
          purpose: '1',
          status: 'A',
          note: 'This was an attempted contact',
          communication_method: 'ABC',
          location: '123'
        }.to_json
      )
    ).to have_been_made

    within '.card-header' do
      expect(page).to have_content('Contact - Investigation 123ABC')
    end
    within '.card-body' do
      expect(page).to have_content 'Date & Time (08/17/2016 3:00 AM)'
      expect(page).to have_content 'Status Attempted'
      expect(page).to have_content 'Purpose Investigate Referral'
      expect(page).to have_content 'Contact Notes (Optional) This was an attempted contact'
      expect(page).to have_content 'Communication Method In person'
      expect(page).to have_content 'Location School'
    end
  end

  scenario 'user does not see location until in person is selected for communication method' do
    expect(page).to_not have_select('Location')
    select 'In person', from: 'Communication Method'
    expect(page).to have_select('Location')
  end
end
