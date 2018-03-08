# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Snapshot relationship card' do
  let(:snapshot) { FactoryGirl.create(:screening) }

  before do
    stub_request(:post, intake_api_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body(snapshot.to_json, status: 201))
    stub_system_codes
  end

  context 'with no relationships' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'snapshot displays the no relationships copy' do
      visit snapshot_path

      within '#relationships-card.card.show' do
        expect(page).to have_content('Search for people and add them to see their')
      end
    end
  end

  context 'load relationships from intake api' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

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
            related_person_id: nil,
            related_person_legacy_id: '789',
            related_person_first_name: 'Jake',
            related_person_last_name: 'Campbell',
            relationship: 'Sister/Brother (Half)',
            related_person_relationship: 'Sister',
            indexed_person_relationship: 'Brother',
            relationship_context: 'Half'
          }, {
            related_person_id: nil,
            related_person_legacy_id: '156',
            related_person_first_name: 'Jane',
            related_person_last_name: 'Campbell',
            relationship: 'Sister/Sister (Half)',
            related_person_relationship: 'Sister',
            indexed_person_relationship: 'Sister',
            relationship_context: 'Half'
          }]
        }
      ]
    end

    before do
      stub_request(
        :get,
        intake_api_url(ExternalRoutes.intake_api_screening_path(participants_screening.id))
      ).and_return(json_body(participants_screening.to_json))

      stub_request(
        :get,
        ferb_api_url(
          ExternalRoutes.ferb_api_screening_history_of_involvements_path(snapshot.id)
        )
      ).and_return(json_body([].to_json, status: 200))

      search_response = PersonSearchResponseBuilder.build do |response|
        response.with_total(1)
        response.with_hits do
          [
            PersonSearchResultBuilder.build do |builder|
              builder.with_first_name('Marge')
            end
          ]
        end
      end
      person = FactoryGirl.create(:participant, first_name: 'Marge', screening_id: snapshot.id)

      stub_person_search(search_term: 'Ma', person_response: search_response)
      stub_request(
        :post,
        intake_api_url(ExternalRoutes.intake_api_screening_people_path(snapshot.id))
      ).and_return(json_body(person.to_json, status: 201))

      stub_request(
        :get,
        intake_api_url(
          ExternalRoutes.intake_api_relationships_by_screening_path(snapshot.id)
        )
      ).and_return(json_body(relationships.to_json, status: 200))

      visit snapshot_path(id: participants_screening.id)

      within '#search-card', text: 'Search' do
        fill_in 'Search for clients', with: 'Ma'
      end

      within '#search-card', text: 'Search' do
        page.find('strong', text: 'Marge').click
      end
    end

    scenario 'should return the correct relationships' do
      within '#relationships-card.card.show', text: 'Relationships' do
        expect(page).to have_content(
          "#{relationships.first[:first_name]} #{relationships.first[:last_name]} is the.."
        )
        expect(page).to have_content('Sister of Jake Campbell')
        expect(page).to have_content('Sister of Jane Campbell')
      end

      expect(
        a_request(
          :get,
          intake_api_url(
            ExternalRoutes.intake_api_relationships_by_screening_path(snapshot.id)
          )
        )
      ).to have_been_made
    end

    scenario 'clicking the Start Over button clears relationships card' do
      within '#relationships-card.card.show' do
        expect(page).to have_content(
          "#{relationships.first[:first_name]} #{relationships.first[:last_name]} is the.."
        )
      end

      click_button 'Start Over'

      within '#relationships-card.card.show' do
        expect(page).to have_content('Search for people and add them to see their relationships')
      end
    end
  end
end
