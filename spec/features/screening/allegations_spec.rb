# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Allegations' do
  scenario 'loading screening with participants generates possible allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    homer = FactoryGirl.create(:participant, first_name: 'Homer', roles: ['Perpetrator'])
    bart = FactoryGirl.create(:participant, first_name: 'Bart', roles: %w(Victim Perpetrator))
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, homer, bart, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within('tbody') do
        table_rows = page.all('tr')
        expect(table_rows.count).to eq(5)

        within(table_rows[0]) do
          expect(page).to have_content('Bart')
          expect(page).to have_content('Marge')
        end

        within(table_rows[1]) do
          expect(page).to have_no_content('Bart')
          expect(page).to have_content('Homer')
        end

        within(table_rows[2]) do
          expect(page).to have_content('Lisa')
          expect(page).to have_content('Marge')
        end

        within(table_rows[3]) do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Homer')
        end

        within(table_rows[4]) do
          expect(page).to have_no_content('Lisa')
          expect(page).to have_content('Bart')
        end
      end
    end
  end

  scenario 'changing the roles of participants creates new possible allegation rows' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge')
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa')
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'thead' do
        expect(page).to have_content('Alleged Victim/Children')
        expect(page).to have_content('Alleged Perpetrator')
        expect(page).to have_content('Allegation(s)')
      end

      expect(page).to have_no_selector('td')
    end

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      marge.roles = ['Perpetrator']
      stub_request(:put, api_participant_path(marge.id))
        .with(body: remove_root_id(marge.as_json))
        .and_return(json_body(marge.to_json, status: 200))
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_no_selector('td')
    end

    within edit_participant_card_selector(lisa.id) do
      fill_in_react_select('Role', with: 'Victim')
      lisa.roles = ['Victim']
      stub_request(:put, api_participant_path(lisa.id))
        .with(body: remove_root_id(lisa.as_json))
        .and_return(json_body(lisa.to_json, status: 200))
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      within('tbody tr') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
        has_react_select_field('Allegation(s)', with: [''])
      end
    end
  end

  scenario 'deleting a participant removes possible allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within('tbody tr') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
      end
    end

    within edit_participant_card_selector(marge.id) do
      stub_request(:delete, api_participant_path(marge.id))
        .and_return(status: 204, headers: { 'Content-Type' => 'application/json' })

      click_button 'Delete participant'
    end

    within '#allegations-card.card.edit' do
      within('table') do
        expect(page).to have_no_content('Lisa')
        expect(page).to have_no_content('Marge')
      end
    end
  end
end
