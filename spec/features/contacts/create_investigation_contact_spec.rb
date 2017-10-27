# frozen_string_literal: true

require 'rails_helper'

feature 'Create Investigation Contact' do
  let(:investigation_id) { '123ABC' }
  let(:people) do
    [
      {
        first_name: 'Emma',
        last_name: 'Woodhouse',
        legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' }
      }, {
        first_name: 'George',
        last_name: 'Knightley',
        legacy_descriptor: { legacy_id: '2', legacy_table_name: 'foo' }
      }
    ]
  end

  before do
    stub_request(
      :get, ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
    ).and_return(json_body({ people: people }.to_json, status: 200))
    visit new_investigation_contact_path(investigation_id: investigation_id)
  end

  scenario 'user can add new contact' do
    within '.card-header' do
      expect(page).to have_content("Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
      select 'Contact status 1', from: 'Status'
      select 'In person', from: 'Communication Method'
      select 'School', from: 'Location'
      find('label', text: 'Emma Woodhouse').click
      select 'Contact purpose 1', from: 'Purpose'
      fill_in 'Contact Notes', with: 'This was an attempted contact'
    end
    expect(page).to have_field('Date/Time', with: '08/17/2016 3:00 AM')
    expect(page).to have_select('Communication Method', selected: 'In person')
    expect(page).to have_checked_field('Emma Woodhouse')
    expect(page).to have_unchecked_field('George Knightley')
    expect(page).to have_select('Location', selected: 'School')
    expect(page).to have_select('Status', selected: 'Contact status 1')
    expect(page).to have_field('Contact Notes', with: 'This was an attempted contact')
    expect(page).to have_select('Purpose', selected: 'Contact purpose 1')

    contact_id = 'new_contact_id'
    show_path = ExternalRoutes.ferb_api_investigations_contact_path(investigation_id, contact_id)
    create_path = ExternalRoutes.ferb_api_investigations_contacts_path(investigation_id)
    persisted_contact = { legacy_descriptor: { legacy_id: contact_id } }
    stub_request(:post, ferb_api_url(create_path)).and_return(
      json_body(persisted_contact.to_json, status: 201)
    )
    stub_request(:get, ferb_api_url(show_path)).and_return(json_body({}.to_json, status: 200))
    click_button 'Save'

    expected_contact = {
      started_at: '2016-08-17T10:00:00.000Z',
      purpose: 'CONTACT_PURPOSE_1',
      status: 'CONTACT_STATUS_1',
      note: 'This was an attempted contact',
      communication_method: 'ABC',
      location: '123',
      people: [{ legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' } }]
    }
    expect(
      a_request(:post, ferb_api_url(create_path)).with(json_body(expected_contact))
    ).to have_been_made
    expect(page).to have_current_path(
      investigation_contact_path(investigation_id: investigation_id, id: contact_id)
    )
  end

  scenario 'user does not see location until in person is selected for communication method' do
    expect(page).to_not have_select('Location')
    select 'In person', from: 'Communication Method'
    expect(page).to have_select('Location')
  end

  scenario "selecting communication method 'In person' resets value for location type" do
    expect(page).to_not have_select('Location')
    select 'Fax', from: 'Communication Method'
    select 'In person', from: 'Communication Method'
    expect(page).to have_select('Location', with_selected: '')
  end

  scenario 'saving with communication method not set to in-person save location as office' do
    fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
    select 'Contact status 1', from: 'Status'
    select 'Fax', from: 'Communication Method'
    find('label', text: 'Emma Woodhouse').click
    select 'Contact purpose 1', from: 'Purpose'
    fill_in 'Contact Notes', with: 'This was an attempted contact'
    click_button 'Save'
    expect(
      a_request(:post, ferb_api_url(ExternalRoutes.ferb_api_investigations_contacts_path('123ABC')))
      .with(
        body: {
          started_at: '2016-08-17T10:00:00.000Z',
          purpose: 'CONTACT_PURPOSE_1',
          status: 'CONTACT_STATUS_1',
          note: 'This was an attempted contact',
          communication_method: 'FAX',
          location: 'OFFICE',
          people: [{ legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' } }]
        }.to_json
      )
    ).to have_been_made
  end
end
