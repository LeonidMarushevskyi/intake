# frozen_string_literal: true

require 'rails_helper'

feature 'Edit Investigation Contact' do
  let(:investigation_id) { 'existing_investigation_id' }
  let(:contact_id) { 'existing_contact_id' }
  let(:started_at) { '2010-04-27T23:30:00.000Z' }
  let(:emma_woodhouse) do
    {
      first_name: 'Emma',
      last_name: 'Woodhouse',
      legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' }
    }
  end
  let(:george_knightley) do
    {
      first_name: 'George',
      last_name: 'Knightley',
      legacy_descriptor: { legacy_id: '2', legacy_table_name: 'foo' }
    }
  end
  let(:investigation) do
    { started_at: '2010-04-27T23:30:00.000Z', people: [emma_woodhouse, george_knightley] }
  end
  let(:contact) do
    {
      id: contact_id,
      started_at: '2010-04-27T23:30:00.000Z',
      purpose: 'CONTACT_PURPOSE_1',
      communication_method: 'ABC',
      status: 'CONTACT_STATUS_1',
      location: '123',
      note: 'This was an attempted contact',
      people: [emma_woodhouse]
    }
  end
  let(:investigation_show_url) do
    investigation_show_path = ExternalRoutes.ferb_api_investigation_path(investigation_id)
    ferb_api_url(investigation_show_path)
  end
  let(:contact_show_url) do
    contact_show_path = ExternalRoutes.ferb_api_investigations_contact_path(
      investigation_id, contact_id
    )
    ferb_api_url(contact_show_path)
  end

  before do
    stub_request(:get, investigation_show_url)
      .and_return(json_body(investigation.to_json, status: 200))
    stub_request(:get, contact_show_url).and_return(json_body(contact.to_json, status: 200))
    visit edit_investigation_contact_path(investigation_id: investigation_id, id: contact_id)
  end

  scenario 'user can edit an existing contact' do
    within '.card-header' do
      expect(page).to have_content("Contact - Investigation #{investigation_id}")
    end
    expect(page).to have_field('Date/Time', with: '04/27/2010 4:30 PM')
    expect(page).to have_select('Communication Method', selected: 'In person')
    expect(page).to have_select('Location', selected: 'School')
    expect(page).to have_select('Status', selected: 'Contact status 1')
    expect(page).to have_checked_field('Emma Woodhouse')
    expect(page).to have_unchecked_field('George Knightley')
    expect(page).to have_select('Purpose', selected: 'Contact purpose 1')
    expect(page).to have_field('Contact Notes', with: 'This was an attempted contact')

    fill_in_datepicker 'Date/Time', with: '08/17/2016 3:00 AM'
    select 'In person', from: 'Communication Method'
    select 'CWS Office', from: 'Location'
    select 'Contact status 2', from: 'Status'
    find('label', text: 'George Knightley').click
    select 'Contact purpose 2', from: 'Purpose'
    fill_in 'Contact Notes', with: 'Updated contact note'
    click_button 'Save'

    expect(
      a_request(:put, contact_show_url)
      .with(
        json_body({
          id: contact_id,
          started_at: '2016-08-17T10:00:00.000Z',
          purpose: 'CONTACT_PURPOSE_2',
          status: 'CONTACT_STATUS_2',
          note: 'Updated contact note',
          communication_method: 'ABC',
          location: 'OFFICE',
          people: [
            { legacy_descriptor: { legacy_id: '1', legacy_table_name: 'foo' } },
            { legacy_descriptor: { legacy_id: '2', legacy_table_name: 'foo' } }
          ]
        }.to_json)
      )
    ).to have_been_made
  end

  scenario 'user clicks cancel' do
    click_button 'Cancel'

    within '.card-header' do
      expect(page).to have_content("Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      expect(page).to have_content 'Date & Time (04/27/2010 4:30 PM)'
      expect(page).to have_content 'Communication Method In person'
      expect(page).to have_content 'Location School'
      expect(page).to have_content 'Status Contact status 1'
      expect(page).to have_content 'Purpose Contact purpose 1'
      expect(page).to have_content 'Emma Woodhouse'
      expect(page).to_not have_content 'George Knightley'
      expect(page).to have_content 'Contact Notes (Optional) This was an attempted contact'
    end
  end
end
