# frozen_string_literal: true

require 'rails_helper'

feature 'Show Investigation Contact' do
  let(:investigation_id) { '123ABC' }
  let(:contact_id) { 'ABC1234567' }
  let(:contact) do
    {
      id: contact_id,
      started_at: '2010-04-27T23:30:00.000',
      purpose: '1',
      communication_method: 'ABC',
      status: 'A',
      location: '123',
      note: 'a sample note',
      people: [{
        first_name: 'John',
        last_name: 'Jones',
        middle_name: 'Bob'
      }]
    }
  end
  let(:contact_show_url) do
    contact_show_path = ExternalRoutes.ferb_api_investigations_contact_path(
      investigation_id, contact_id
    )
    ferb_api_url(contact_show_path)
  end

  scenario 'user can view an existing contact' do
    stub_request(:get, contact_show_url).and_return(json_body(contact.to_json, status: 200))
    visit investigation_contact_path(investigation_id: investigation_id, id: contact_id)

    within '.card-header' do
      expect(page).to have_content("Contact - Investigation #{investigation_id}")
    end
    within '.card-body' do
      expect(page).to have_content 'Date & Time (04/27/2010 11:30 PM)'
      expect(page).to have_content 'Status Attempted'
      expect(page).to have_content 'Purpose Investigate Referral'
      expect(page).to have_content 'Contact Notes (Optional) a sample note'
      expect(page).to have_content 'Communication Method In person'
      expect(page).to have_content 'Location School'
      expect(page).to have_content 'John Bob Jones'
    end

    expect(a_request(:get, contact_show_url)).to have_been_made
  end
end
