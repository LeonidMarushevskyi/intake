# frozen_string_literal: true

require 'rails_helper'

feature 'Contact Log' do
  let(:investigation_id) { 'existing_investigation_id' }
  let(:sam_jones) do
    {
      first_name: 'Sam',
      middle_name: 'L.',
      last_name: 'Jones'
    }
  end
  let(:robert_smith) do
    {
      first_name: 'Robert',
      middle_name: 'Hughes',
      last_name: 'Smith'
    }
  end
  let(:dave_hughes) do
    {
      first_name: 'Dave',
      middle_name: 'William',
      last_name: 'Hughes'
    }
  end
  let(:note_first_30_words) { FFaker::Lorem.words(30).join(' ') }
  let(:note_more_than_30_words) { "#{note_first_30_words} 31st_word" }
  let(:note_with_line_breaks) { "A sample note \n \n \n \n including line breaks" }
  let(:investigation) do
    {
      legacy_descriptor: { legacy_id: investigation_id },
      contacts: [{
        legacy_descriptor: { legacy_id: 'existing_contact_1' },
        started_at: '2017-01-26T10:00:00.000Z',
        communication_method: 'COMMUNICATION_METHOD_2',
        status: 'CONTACT_STATUS_2',
        note: note_with_line_breaks,
        people: [sam_jones, dave_hughes]
      }, {
        legacy_descriptor: { legacy_id: 'existing_contact_2' },
        started_at: '2017-01-27T14:00:00.000Z',
        communication_method: 'COMMUNICATION_METHOD_1',
        status: 'CONTACT_STATUS_1',
        note: note_more_than_30_words,
        people: [robert_smith, dave_hughes]
      }]
    }
  end
  let(:investigation_show_url) do
    ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
  end
  before do
    stub_request(:get, investigation_show_url)
      .and_return(json_body(investigation.to_json, status: 200))
  end
  scenario 'lists the investigations contacts' do
    visit investigation_path(id: investigation_id)

    within '.card.show', text: 'Contact Log' do
      within '.card-header' do
        expect(page).to have_content('Contact Log (2)')
      end
      within '.card-body' do
        within :xpath, './/thead' do
          expect(page).to have_content('Date/Time')
          expect(page).to have_content('People present')
          expect(page).to have_content('Method/Status')
          expect(page).to have_content('Notes')
        end
        within :xpath, './/tbody//tr[1]' do
          expect(page).to have_content('01/26/2017 3:00 AM')
          expect(page).to have_content('Sam L. Jones, Dave William Hughes')
          expect(page).to have_content 'Communication method 2 (Contact status 2)'
          expect(page).to have_content note_with_line_breaks.strip
          expect(page).to have_link(
            'View contact',
            href: investigation_contact_path(
              investigation_id: investigation_id, id: 'existing_contact_1'
            )
          )
        end
        within :xpath, './/tbody//tr[2]' do
          expect(page).to have_content '01/27/2017 7:00 AM'
          expect(page).to have_content 'Robert Hughes Smith, Dave William Hughes'
          expect(page).to have_content 'In person (Contact status 1)'
          expect(page).to have_content "#{note_first_30_words}..."
          expect(page).to_not have_content note_more_than_30_words
          expect(page).to have_link(
            'View contact',
            href: investigation_contact_path(
              investigation_id: investigation_id, id: 'existing_contact_2'
            )
          )
        end
        expect(page).to have_link(
          'Create New Contact',
          href: new_investigation_contact_path(investigation_id: investigation_id)
        )
        expect(page.find_link('Create New Contact')[:target]).to eq '_blank'
      end
    end
  end
end
