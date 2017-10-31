# frozen_string_literal: true

require 'rails_helper'

feature 'Show Investigation Contact' do
  let(:investigation_id) { '123ABC' }
  let(:contact_id) { 'ABC1234567' }
  let(:john_jones) do
    {
      first_name: 'John',
      last_name: 'Jones',
      middle_name: 'Bob',
      legacy_descriptor: { legacy_id: '1' }
    }
  end
  let(:investigation) do
    { people: [john_jones] }
  end
  let(:contact) do
    {
      id: contact_id,
      started_at: '2010-04-27T23:30:00.000Z',
      purpose: 'CONTACT_PURPOSE_1',
      communication_method: 'COMMUNICATION_METHOD_1',
      status: 'CONTACT_STATUS_1',
      location: '123',
      note: 'a sample note',
      people: [john_jones]
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
    visit investigation_contact_path(investigation_id: investigation_id, id: contact_id)
  end

  scenario 'user can view an existing contact' do
    within '.card-header' do
      expect(page).to have_content("Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      expect(page).to have_content 'Date & Time (04/27/2010 4:30 PM)'
      expect(page).to have_content 'Communication Method In person'
      expect(page).to have_content 'Location School'
      expect(page).to have_content 'Status Contact status 1'
      expect(page).to have_content 'John Bob Jones'
      expect(page).to have_content 'Purpose Contact purpose 1'
      expect(page).to have_content 'Contact Notes (Optional) a sample note'
    end

    expect(a_request(:get, contact_show_url)).to have_been_made
  end

  scenario 'user clicks edit' do
    click_link 'Edit contact'

    expect(page).to have_field('Date/Time', with: '04/27/2010 4:30 PM')
    expect(page).to have_select('Communication Method', selected: 'In person')
    expect(page).to have_select('Location', selected: 'School')
    expect(page).to have_select('Status', selected: 'Contact status 1')
    expect(page).to have_checked_field('John Bob Jones')
    expect(page).to have_select('Purpose', selected: 'Contact purpose 1')
    expect(page).to have_field('Contact Notes', with: 'a sample note')
  end
end
