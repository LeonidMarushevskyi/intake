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
    let(:screening_involvement) do
      [
        {
          start_date: '2016-09-10',
          county_name: 'el_dorado',
          # until we have users, TPT is saving the entire name in the last_name field
          assigned_social_worker: { first_name: nil, last_name: 'Bob Smith' },
          reporter: { first_name: 'Alex', last_name: 'Hanson' },
          all_people: [
            { first_name: 'Bob', last_name: 'Bob Smith', roles: ['Assigned Social Worker'] },
            { first_name: 'Alex', last_name: 'Hanson', roles: ['Reporter'] },
            { first_name: 'Sally', last_name: 'Johnson', roles: ['Victim'] },
            { first_name: 'Sam', last_name: 'Anderson', roles: ['Perpetrator'] },
            { first_name: 'James', last_name: 'Robinson', roles: [] }
          ]
        }
      ]
    end

    before do
      lana = FactoryGirl.create(:participant, first_name: 'Lana', legacy_id: 2)
      archer = FactoryGirl.create(:participant, first_name: 'Archer', legacy_id: 1)
      existing_screening.participants = [lana, archer]

      stub_request(:get, intake_api_screening_url(existing_screening.id))
        .and_return(json_body(existing_screening.to_json))

      stub_request(
        :get,
        intake_api_history_of_involvements_url(existing_screening.id)
      ).and_return(json_body(screening_involvement.to_json, status: 200))

      stub_request(
        :get,
        intake_api_relationships_by_screening_url(existing_screening.id)
      ).and_return(json_body([].to_json, status: 200))
    end

    scenario 'viewing a screening' do
      visit screening_path(id: existing_screening.id)

      within '#history-card.card.show', text: 'HISTORY' do
        start_time = Time.parse(screening_involvement.first[:start_date]).strftime('%m/%d/%Y')
        expect(page).to have_content(start_time)
        expect(page).to have_content('Screening (In Progress)')
        expect(page).to have_content('El Dorado')
        expect(page).to have_content('Sally Johnson')
        expect(page).to have_content('Sam Anderson')
        expect(page).to have_content('James Robinson')
        expect(page).to have_content('Reporter: Alex Hanson')
        expect(page).to have_content('Worker: Bob Smith')
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

      expect(
        a_request(
          :get,
          intake_api_history_of_involvements_url(existing_screening.id)
        )
      ).to have_been_made

      within '#history-card.card.show', text: 'HISTORY' do
        start_time = Time.parse(screening_involvement.first[:start_date]).strftime('%m/%d/%Y')
        expect(page).to have_content(start_time)
        expect(page).to have_content('Screening (In Progress)')
        expect(page).to have_content('El Dorado')
        expect(page).to have_content('Sally Johnson')
        expect(page).to have_content('Sam Anderson')
        expect(page).to have_content('James Robinson')
        expect(page).to have_content('Reporter: Alex Hanson')
        expect(page).to have_content('Worker: Bob Smith')
      end
    end
  end
end
