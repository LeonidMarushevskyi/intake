# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'show allegations' do
  scenario 'editing existing allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    homer = FactoryGirl.create(:participant, first_name: 'Homer', roles: ['Perpetrator'])
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
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

    visit screening_path(id: screening.id)

    within '#allegations-card.card.show' do
      within 'thead' do
        expect(page).to have_content('Alleged Victim/Children')
        expect(page).to have_content('Alleged Perpetrator')
        expect(page).to have_content('Allegation(s)')
      end

      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to_not have_content('Homer')
      end
    end

    within '#allegations-card.card.show' do
      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      within 'tbody' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Homer')
      end
      click_button 'Save'
    end

    new_allegation = FactoryGirl.build(
      :allegation,
      victim_id: lisa.id,
      perpetrator_id: homer.id,
      screening_id: screening.id
    )
    screening.allegations << new_allegation

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(json_body(remove_root_id(screening.as_json).merge('participants' => [])))
    ).to have_been_made
  end

  scenario 'deleting a participant removes related allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    homer = FactoryGirl.create(:participant, first_name: 'Homer', roles: ['Perpetrator'])
    screening = FactoryGirl.create(
      :screening,
      participants: [marge, homer, lisa]
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

    visit screening_path(id: screening.id)

    within '#allegations-card.card.show' do
      within 'tbody tr' do
        expect(page).to have_content('Marge')
        expect(page).to have_content('Lisa')
      end
    end

    within show_participant_card_selector(marge.id) do
      click_button 'Delete participant'
    end

    within '#allegations-card.card.show' do
      within 'tbody', visible: false do
        expect(page).to_not have_content('Marge')
        expect(page).to_not have_content('Lisa')
      end

      click_link 'Edit allegations'
    end

    within '#allegations-card.card.edit' do
      within 'tbody' do
        expect(page).to have_content('Lisa')
        expect(page).to have_content('Homer')
        expect(page).to_not have_content('Marge')
      end
    end
  end

  scenario 'saving another card will not persists changes to allegations' do
    marge = FactoryGirl.create(:participant, first_name: 'Marge', roles: ['Perpetrator'])
    lisa = FactoryGirl.create(:participant, first_name: 'Lisa', roles: ['Victim'])
    screening = FactoryGirl.create(:screening, participants: [marge, lisa])
    stub_request(:get, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    visit screening_path(id: screening.id)

    screening.name = 'Hello'
    stub_request(:put, api_screening_path(screening.id))
      .and_return(json_body(screening.to_json, status: 200))

    within '#allegations-card.card.show' do
      click_link 'Edit allegations'
    end

    within '#screening-information-card.card.show' do
      click_link 'Edit screening information'
    end

    within '#screening-information-card.card.edit' do
      fill_in 'Title/Name of Screening', with: 'Hello'
      click_button 'Save'
    end

    expect(
      a_request(:put, api_screening_path(screening.id))
      .with(json_body(remove_root_id(screening.as_json).merge('participants' => [])))
    ).to have_been_made
  end
end
