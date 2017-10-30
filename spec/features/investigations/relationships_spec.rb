# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Investigation Relationship Card' do
  let(:investigation_id) { '1234' }
  let(:relationships) { [{}] }

  before do
    stub_request(
      :get,
      ferb_api_url(ExternalRoutes.ferb_api_investigation_path(investigation_id))
    ).and_return(json_body({ relationships: relationships }.to_json), status: 200)
  end

  context 'an investigation without participants' do
    scenario 'the relationships card displays the empty relationship message' do
      visit investigation_path(id: investigation_id)
      within '.card.show', text: 'Relationships' do
        expect(page).to have_content('Search for people and add them to see their relationships.')
      end
    end
  end

  context 'an investigation with participants' do
    let(:relationship) do
    end

    let(:relationships) do
      [
        {
          first_name: 'Ricky',
          last_name: 'W.',
          middle_name: '',
          relationship_to: [
            {
              related_person_first_name: 'Marty',
              indexed_person_relationship: 'Father',
              related_person_last_name: 'R.'
            },
            {
              related_person_first_name: 'Missy',
              indexed_person_relationship: 'Spouse',
              related_person_last_name: 'R.'
            },
            {
              related_person_first_name: 'Roland',
              indexed_person_relationship: 'Father',
              related_person_last_name: 'W.'
            },
            {
              related_person_first_name: 'Sharon',
              indexed_person_relationship: 'Father',
              related_person_last_name: 'W.'
            }
          ]
        }
      ]
    end
    scenario 'displays the relationships on page load' do
      visit investigation_path(id: investigation_id)
      within '.card.show', text: 'Relationships' do
        expect(page.first('.person')).to have_content('Ricky W.')
        expect(page.find('.relationships li', text: 'Father of Marty R.')).to be_truthy
        expect(page.find('.relationships li', text: 'Spouse of Missy R.')).to be_truthy
        expect(page.find('.relationships li', text: 'Father of Roland W.')).to be_truthy
        expect(page.find('.relationships li', text: 'Father of Sharon W.')).to be_truthy
      end
    end
  end
end
