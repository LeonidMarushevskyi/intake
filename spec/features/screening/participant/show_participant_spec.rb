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
  phone_number = FactoryGirl.create(:phone_number, number: '4567891234', type: 'Home')

  date_of_birth = rand(100..1000).weeks.ago

  existing_participant = FactoryGirl.create(
    :participant,
    date_of_birth: date_of_birth.to_s(:db),
    gender: 'male',
    middle_name: 'Jay',
    name_suffix: 'esq',
    ssn: '123-__-____',
    sealed: false,
    sensitive: true,
    addresses: [address],
    roles: ['Victim', 'Mandated Reporter'],
    phone_numbers: [phone_number],
    languages: %w[Korean Lao Hawaiian]
  )
  existing_screening = FactoryGirl.create(
    :screening,
    participants: [existing_participant]
  )

  before do
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(existing_screening.id)))
      .and_return(json_body(existing_screening.to_json, status: 200))
    stub_empty_history_for_screening(existing_screening)
    stub_empty_relationships_for_screening(existing_screening)
  end

  scenario 'showing existing participant' do
    visit screening_path(id: existing_screening.id)

    within show_participant_card_selector(existing_participant.id) do
      within '.card-header' do
        expect(page).to have_content('Sensitive')
        expect(page).to have_content(
          "#{existing_participant.first_name} Jay #{existing_participant.last_name}, Esq"
        )
        expect(page).to have_link 'Edit participant'
        expect(page).to have_button 'Delete participant'
      end

      within '.card-body' do
        table_description = existing_participant.legacy_descriptor.legacy_table_description
        ui_id = existing_participant.legacy_descriptor.legacy_ui_id
        expect(page).to have_content("#{table_description} ID #{ui_id} in CWS-CMS")
        expect(page).to have_content(
          "#{existing_participant.first_name} Jay #{existing_participant.last_name}, Esq"
        )
        expect(page).to have_content('(456)789-1234')
        expect(page).to have_content('Home')
        expect(page).to have_content('Male')
        expect(page).to have_content('Victim')
        expect(page).to have_content('Mandated Reporter')
        expect(page).to have_content('Korean, Lao, Hawaiian')
        expect(page).to have_content(date_of_birth.strftime('%m/%d/%Y'))
        expect(page).to have_content('123-  -    ')
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
