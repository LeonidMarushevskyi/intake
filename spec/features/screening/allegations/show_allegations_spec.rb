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
    end
  end
end
