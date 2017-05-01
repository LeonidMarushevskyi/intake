# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'History card' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'edit an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit edit_screening_path(id: existing_screening.id)

    within '#history-card.card.show.card', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end

  scenario 'view an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit screening_path(id: existing_screening.id)

    within '#history-card.card.show', text: 'HISTORY' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end

  context 'a screening with participants' do
    let(:started_at) { 2.days.ago }
    let(:victim_archer) { FactoryGirl.create(:participant, :victim, first_name: 'Archer') }
    let(:perpetrator) { FactoryGirl.create(:participant, :perpetrator) }
    let(:participant_without_role) do
      FactoryGirl.create(:participant, first_name: 'Participant Without Role', roles: [])
    end
    let(:reporter) { FactoryGirl.create(:participant, :reporter) }
    let(:worker) { 'Intake Worker' }

    before do
      lana = FactoryGirl.create(:participant, first_name: 'Lana', person_id: 2)
      archer = FactoryGirl.create(:participant, first_name: 'Archer', person_id: 1)
      unknown = FactoryGirl.create(:participant, first_name: 'Unknown', person_id: nil)
      existing_screening.participants = [unknown, lana, archer]

      screening_involvement = {
        started_at: started_at,
        ended_at: nil,
        assignee: worker,
        incident_county: 'Sacramento',
        participants: [reporter, victim_archer, perpetrator, participant_without_role]
      }

      stub_request(:get, intake_api_screening_url(existing_screening.id))
        .and_return(json_body(existing_screening.to_json))
      stub_request(
        :get,
        intake_api_history_of_involvements_url(existing_screening.id)
      ).and_return(json_body([screening_involvement].to_json, status: 200))
    end

    scenario 'viewing a screening' do
      visit screening_path(id: existing_screening.id)

      within '#history-card.card.show', text: 'HISTORY' do
        expect(page).to have_content(started_at.strftime('%m/%d/%Y'))
        expect(page).to have_content('Screening (In Progress)')
        expect(page).to have_content('Sacramento')
        expect(page).to have_content(victim_archer.first_name)
        expect(page).to have_content(victim_archer.last_name)
        expect(page).to have_content(perpetrator.first_name)
        expect(page).to have_content(perpetrator.last_name)
        expect(page).to have_content(participant_without_role.first_name)
        expect(page).to have_content(participant_without_role.last_name)
        expect(page).to have_content("Reporter: #{reporter.first_name} #{reporter.last_name}")
        expect(page).to have_content("Worker: #{worker}")
      end

      expect(
        a_request(
          :get,
          intake_api_history_of_involvements_url(existing_screening.id)
        )
      ).to have_been_made
    end

    scenario 'editing a screening' do
      visit edit_screening_path(id: existing_screening.id)

      within '#history-card.card.show', text: 'HISTORY' do
        expect(page).to have_content(started_at.strftime('%m/%d/%Y'))
        expect(page).to have_content('Screening (In Progress)')
        expect(page).to have_content('Sacramento')
        expect(page).to have_content(victim_archer.first_name)
        expect(page).to have_content(victim_archer.last_name)
        expect(page).to have_content(perpetrator.first_name)
        expect(page).to have_content(perpetrator.last_name)
        expect(page).to have_content("Reporter: #{reporter.first_name} #{reporter.last_name}")
        expect(page).to have_content("Worker: #{worker}")
      end

      expect(
        a_request(
          :get,
          intake_api_history_of_involvements_url(existing_screening.id)
        )
      ).to have_been_made
    end
  end
end
