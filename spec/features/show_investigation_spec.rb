# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Show Investigation' do
  context 'when investigations is enabled' do
    around do |example|
      Feature.run_with_activated(:investigations) do
        example.run
      end
    end

    scenario 'user navigates to the investigation show page' do
      investigation_id = '12345'
      screening_summary = {
        id: '222',
        name: 'My Screening',
        decision_detail: 'immediate',
        additional_information: 'There was considerable evidence abuse',
        allegations: [{
          victim_id: '2',
          perpetrator_id: '3',
          allegation_types: ['Severe neglect']
        }, {
          victim_id: '2',
          perpetrator_id: '4',
          allegation_types: ['Severe neglect', 'Sexual abuse']
        }],
        safety_alerts: [
          'Dangerous Animal on Premises',
          'Firearms in Home',
          'Hostile, Aggressive Client',
          'Remote or Isolated Location'
        ],
        safety_information: 'Animal is a tiger'
      }
      stub_request(
        :get, ferb_api_url(ExternalRoutes.ferb_api_investigations_screening(investigation_id))
      ).and_return(json_body(screening_summary.to_json, status: 200))
      visit investigation_path(id: investigation_id)
      within '.card.show', text: 'Screening Summary' do
        within '.card-body' do
          within :xpath, ".//div[@class='row'][1]" do
            expect(page).to have_link 'My Screening', href: screening_path(id: '222')
            expect(page).to have_content 'Immediate'
            expect(page).to have_content 'Severe neglect', count: 1
            expect(page).to have_content 'Sexual abuse'
          end
          within :xpath, ".//div[@class='row'][2]" do
            expect(page).to have_content 'Dangerous Animal on Premises'
            expect(page).to have_content 'Firearms in Home'
            expect(page).to have_content 'Hostile, Aggressive Client'
            expect(page).to have_content 'Remote or Isolated Location'
            expect(page).to have_content 'Animal is a tiger'
          end
          within :xpath, ".//div[@class='row'][3]" do
            expect(page).to have_content 'There was considerable evidence abuse'
          end
        end
      end

      within '.card.show', text: 'Contact Log' do
        contact_url = new_investigation_contact_path(investigation_id: investigation_id)
        expect(page).to have_link 'Create New Contact', href: contact_url
        expect(page.find_link('Create New Contact')[:target]).to eq '_blank'
      end
    end
  end

  context 'when investigations is disabled' do
    around do |example|
      Feature.run_with_deactivated(:investigations) do
        example.run
      end
    end

    scenario 'view an existing screening returns 404', browser: :poltergeist do
      investigation_id = '12345'
      visit investigation_path(id: investigation_id)
      expect(
        a_request(
          :get,
          intake_api_url(ExternalRoutes.ferb_api_investigations_screening(investigation_id))
        )
      ).to_not have_been_made
      expect(page.status_code).to_not eq 200
    end
  end
end
