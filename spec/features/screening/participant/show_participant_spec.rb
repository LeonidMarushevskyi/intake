# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Show Screening' do
  existing_participant = FactoryGirl.create(
    :participant,
    first_name: 'Homer',
    last_name: 'Simpson',
    gender: 'male',
    ssn: '123-23-1234',
    date_of_birth: '1990-09-05'
  )
  existing_screening = FactoryGirl.create(
    :screening,
    participants: [existing_participant]
  )

  before do
    faraday_helper do |stub|
      stub.get("/api/v1/screenings/#{existing_screening.id}") do |_|
        [200, {}, existing_screening.as_json]
      end
    end
  end

  scenario 'showing existing participant' do
    visit screening_path(id: existing_screening.id)

    within show_participant_card_selector(existing_participant.id) do
      within '.card-header' do
        expect(page).to have_content 'HOMER SIMPSON'
        expect(page).to have_link 'Edit participant'
        expect(page).to have_link 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_content('Homer')
        expect(page).to have_content('Simpson')
        expect(page).to have_content('Male')
        expect(page).to have_content('1990-09-05')
        expect(page).to have_content('123-23-1234')
      end
    end
  end

  scenario 'editing an existing participant on the show page' do
    visit screening_path(id: existing_screening.id)

    within show_participant_card_selector(existing_participant.id) do
      click_link 'Edit participant'
    end

    expect(page).to have_css(edit_participant_card_selector(existing_participant.id))
  end
end
