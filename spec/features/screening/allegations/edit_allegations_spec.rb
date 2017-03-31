# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'edit allegations' do
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

  scenario 'removing participant role, re-adding it does not show deleted allegations' do
    marge = FactoryGirl.create(
      :participant,
      first_name: 'Marge',
      roles: ['Perpetrator', 'Anonymous Reporter']
    )
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, lisa]
    )
    allegation = FactoryGirl.create(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id
    )
    screening.allegations << allegation
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
      end
      click_button 'Cancel'
    end

    marge.roles = ['Anonymous Reporter']
    stub_request(:put, api_participant_path(marge.id))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))

    screening.allegations = []
    screening.participants = [lisa, marge]
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      remove_react_select_option('Role', 'Perpetrator')
      click_button 'Save'
    end

    within '#allegations-card.card.show' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_link 'Edit participant'
    end

    marge.roles = ['Anonymous Reporter', 'Perpetrator']
    stub_request(:put, api_participant_path(marge.id))
      .with(json_body(as_json_without_root_id(marge)))
      .and_return(json_body(marge.to_json, status: 200))

    screening.participants = [lisa, marge]
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      fill_in_react_select('Role', with: 'Perpetrator')
      click_button 'Save'
    end

    within '#allegations-card.card.show' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
      end

      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
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
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      expect(page).to have_no_selector('td')
    end

    lisa.roles = ['Victim']
    stub_request(:put, api_participant_path(lisa.id))
      .with(body: as_json_without_root_id(lisa))
      .and_return(json_body(lisa.to_json, status: 200))

    screening.participants = [marge, lisa]
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within edit_participant_card_selector(lisa.id) do
      fill_in_react_select('Role', with: 'Victim')
      click_button 'Save'
    end

    within '#allegations-card.card.edit' do
      within('tbody tr') do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
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

  scenario 'saving allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    allegation_attributes = {
      victim_id: lisa.id,
      perpetrator_id: marge.id,
      screening_id: screening.id
    }

    screening_with_new_allegation = screening.dup.tap do |obj|
      obj.assign_attributes(
        allegations: [FactoryGirl.build(:allegation, allegation_attributes)]
      )
    end

    persisted_allegation = FactoryGirl.create(:allegation, allegation_attributes)
    screening.assign_attributes(allegations: [persisted_allegation])

    stub_request(:put, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within '#allegations-card.card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(body: as_json_without_root_id(screening_with_new_allegation).merge('participants' => []))
    ).to have_been_made

    within '#allegations-card.card.show' do
      within 'table tbody tr' do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Marge')
      end
    end
  end

  scenario 'cancel editing allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    within '#allegations-card.card.edit' do
      click_button 'Cancel'
    end

    within '#allegations-card.card.show' do
      within('table') do
        expect(page).to have_no_content('Lisa')
        expect(page).to have_no_content('Marge')
      end
    end
  end

  scenario 'saving another card will not persists changes to allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit edit_screening_path(id: screening.id)

    screening.name = 'Hello'
    stub_request(:put, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within '#screening-information-card.card.edit' do
      fill_in 'Title/Name of Screening', with: 'Hello'
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(json_body(as_json_without_root_id(screening).merge('participants' => [])))
    ).to have_been_made
  end
end
