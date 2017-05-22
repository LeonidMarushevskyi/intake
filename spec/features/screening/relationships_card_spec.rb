# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Relationship card' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  context 'a screening without participants' do
    scenario 'edit an existing screening' do
      stub_request(:get, intake_api_screening_url(existing_screening.id))
        .and_return(json_body(existing_screening.to_json))
      stub_request(:get, intake_api_relationships_by_screening_url(existing_screening.id))
        .and_return(json_body([].to_json, status: 200))
      visit edit_screening_path(id: existing_screening.id)

      within '#relationships-card', text: 'Relationships' do
        expect(page).to have_content('Add people to see their relationships here.')
      end

      expect(
        a_request(
          :get,
          intake_api_relationships_by_screening_url(existing_screening.id)
        )
      ).to_not have_been_made
    end

    scenario 'view an existing screening' do
      stub_request(:get, intake_api_screening_url(existing_screening.id))
        .and_return(json_body(existing_screening.to_json))
      stub_request(:get, intake_api_relationships_by_screening_url(existing_screening.id))
        .and_return(json_body([].to_json, status: 200))
      visit screening_path(id: existing_screening.id)

      within '#relationships-card', text: 'Relationships' do
        expect(page).to have_content('Add people to see their relationships here.')
      end

      expect(
        a_request(
          :get,
          intake_api_relationships_by_screening_url(existing_screening.id)
        )
      ).to_not have_been_made
    end
  end

  context 'a screening with participants' do
    let(:participant) { FactoryGirl.create(:participant) }
    let(:participants_screening) do
      FactoryGirl.create(:screening, participants: [participant])
    end
    let(:relationships) do
      [
        {
          id: participant.id.to_s,
          first_name: participant.first_name,
          last_name: participant.last_name,
          relationships: [{
            related_person_id: '7',
            related_person_first_name: 'Jake',
            related_person_last_name: 'Campbell',
            relationship: 'Sister/Brother (Half)',
            related_person_relationship: 'Brother',
            indexed_person_relationship: 'Sister',
            relationship_context: 'Half'
          }]
        }
      ]
    end
    let(:marge) do
      FactoryGirl.create(
        :person,
        date_of_birth: 5.years.ago.to_s(:db),
        first_name: 'Marge',
        gender: 'female',
        last_name: 'Simpson',
        ssn: '123-23-1234',
        languages: %w[French Italian],
        addresses: [],
        phone_numbers: [],
        races: [
          { race: 'White', race_detail: 'European' },
          { race: 'American Indian or Alaska Native' }
        ],
        ethnicity: { hispanic_latino_origin: 'Yes', ethnicity_detail: 'Central American' }
      )
    end

    before do
      stub_request(:get, intake_api_screening_url(participants_screening.id))
        .and_return(json_body(participants_screening.to_json))
      stub_request(
        :get,
        intake_api_relationships_by_screening_url(participants_screening.id)
      ).and_return(json_body(relationships.to_json, status: 200))
    end

    scenario 'viewing a screening' do
      visit screening_path(id: participants_screening.id)

      within '#relationships-card.card.show', text: 'Relationships' do
        expect(page).to have_content(
          "#{relationships.first[:first_name]} #{relationships.first[:last_name]} is the.."
        )
        expect(page).to have_content('Sister of Jake Campbell')
      end

      expect(
        a_request(
          :get,
          intake_api_relationships_by_screening_url(participants_screening.id)
        )
      ).to have_been_made
    end

    describe 'editing a screening' do
      scenario 'loads relationships on initial page load' do
        visit edit_screening_path(id: participants_screening.id)

        within '#relationships-card.card.show', text: 'Relationships' do
          expect(page).to have_content(
            "#{relationships.first[:first_name]} #{relationships.first[:last_name]} is the.."
          )
          expect(page).to have_content('Sister of Jake Campbell')
        end

        expect(
          a_request(:get, intake_api_relationships_by_screening_url(participants_screening.id))
        ).to have_been_made
      end

      scenario 'removing a person updates relationships' do
        stub_request(:get, intake_api_relationships_by_screening_url(participants_screening.id))
          .and_return(json_body([].to_json, status: 200))
        stub_request(:delete, intake_api_participant_url(participant.id))

        visit edit_screening_path(id: participants_screening.id)
        within edit_participant_card_selector(participant.id) do
          within '.card-header' do
            click_button 'Delete participant'
          end
        end

        expect(
          a_request(:get, intake_api_relationships_by_screening_url(participants_screening.id))
        ).to have_been_made.twice

        within '#relationships-card.card.show', text: 'Relationships' do
          expect(page).to have_content('Add people to see their relationships here.')
        end
      end

      scenario 'adding a new person updates relationships' do
        visit edit_screening_path(id: participants_screening.id)
        new_participant = FactoryGirl.create(
          :participant, :unpopulated,
          screening_id: participants_screening.id
        )
        new_participant_request = { screening_id: participants_screening.id, legacy_id: nil }

        %w[Ma Mar Marg Marge].each do |search_text|
          stub_request(:get, intake_api_people_search_url(search_term: search_text))
            .and_return(body: [marge].to_json,
                        status: 200,
                        headers: { 'Content-Type' => 'application/json' })
        end

        stub_request(:post, intake_api_participants_url)
          .with(body: new_participant.as_json(except: :id).merge(new_participant_request))
          .and_return(body: new_participant.to_json,
                      status: 201,
                      headers: { 'Content-Type' => 'application/json' })

        new_relationships = [
          {
            id: participant.id.to_s,
            first_name: participant.first_name,
            last_name: participant.last_name,
            relationships: [{
              related_person_first_name: 'Jake',
              related_person_last_name: 'Campbell',
              relationship: 'Sister/Brother (Half)',
              related_person_relationship: 'Brother',
              indexed_person_relationship: 'Sister',
              relationship_context: 'Half',
              related_person_id: '7'
            }]
          },
          {
            id: new_participant.id.to_s,
            first_name: new_participant.first_name,
            last_name: new_participant.last_name,
            relationships: []
          }
        ]

        stub_request(:get, intake_api_relationships_by_screening_url(participants_screening.id))
          .and_return(json_body(new_relationships.to_json, status: 200))

        within '#search-card', text: 'Search' do
          fill_in_autocompleter 'Search for any person', with: 'Marge'
          find('.btn', text: /Create a new person/).click
          expect(page).not_to have_content('Create a new person')
        end

        expect(
          a_request(:get, intake_api_relationships_by_screening_url(participants_screening.id))
        ).to have_been_made.twice

        within edit_participant_card_selector(new_participant.id) do
          within '.card-header' do
            expect(page).to have_content 'Unknown Person'
          end
        end

        within '#relationships-card.card.show', text: 'Relationships' do
          expect(page).to have_content(
            "#{relationships.first[:first_name]} #{relationships.first[:last_name]} is the.."
          )
          expect(page).to have_content('Sister of Jake Campbell')
          expect(page).to have_content(
            "#{new_participant.first_name} #{new_participant.last_name} has no known relationships"
          )
        end
      end
    end
  end
end
