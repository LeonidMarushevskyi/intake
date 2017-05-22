# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Show Screening' do
  address = FactoryGirl.create(
    :address,
    street_address: '123 Fake St',
    city: 'Springfield',
    state: 'NY',
    zip: '12345',
    type: 'Home'
  )
  phone_number = FactoryGirl.create(
    :phone_number
  )

  existing_participant = FactoryGirl.create(
    :participant,
    middle_name: 'Jay',
    name_suffix: 'esq',
    addresses: [address],
    phone_numbers: [phone_number]
  )
  existing_screening = FactoryGirl.create(
    :screening,
    participants: [existing_participant]
  )

  before do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(body: existing_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })
    stub_request(
      :get,
      intake_api_history_of_involvements_url(existing_screening.id)
    ).and_return(json_body([].to_json, status: 200))
  end

  scenario 'showing existing participant' do
    visit screening_path(id: existing_screening.id)

    within show_participant_card_selector(existing_participant.id) do
      within '.card-header' do
        expect(page).to have_content(
          "#{existing_participant.first_name} Jay #{existing_participant.last_name}, Esq"
        )
        expect(page).to have_link 'Edit participant'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_content(
          "#{existing_participant.first_name} Jay #{existing_participant.last_name}, Esq"
        )
        expect(page).to have_content(phone_number.number)
        expect(page).to have_content(phone_number.type)
        expect(page).to have_content(existing_participant.gender.capitalize)
        expect(page).to have_content(existing_participant.languages.join(', '))
        expect(page).to have_content(existing_participant.date_of_birth)
        expect(page).to have_content(existing_participant.ssn)
        expect(page).to have_content(address.street_address)
        expect(page).to have_content(address.city)
        expect(page).to have_content('New York')
        expect(page).to have_content(address.zip)
        expect(page).to have_content(address.type)
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
