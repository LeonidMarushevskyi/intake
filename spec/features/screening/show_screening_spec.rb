# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'Show Screening' do
  scenario 'showing existing screening' do
    address = FactoryGirl.create(
      :address,
      street_address: '123 fake st',
      city: 'Springfield',
      state: 'NY',
      zip: '12345'
    )
    existing_screening = FactoryGirl.create(
      :screening,
      communication_method: 'mail',
      ended_at: '2016-08-22T11:00:00.000Z',
      incident_county: 'sacramento',
      incident_date: '2016-08-11',
      location_type: "Child's Home",
      name: 'The Rocky Horror Picture Show',
      reference: 'My Bad!',
      report_narrative: 'some narrative',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'evaluate_out',
      started_at: '2016-08-13T10:00:00.000Z',
      address: address
    )

    stub_request(:get, api_screening_path(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))

    visit screening_path(id: existing_screening.id)

    expect(page).to have_content 'Screening #My Bad!'

    within '#screening-information-card' do
      expect(page).to have_content 'Mail'
      expect(page).to have_content 'The Rocky Horror Picture Show'
      expect(page).to have_content '8/13/2016 10:00 AM'
      expect(page).to have_content '8/22/2016 11:00 AM'
    end

    within '#narrative-card.show' do
      expect(page).to have_content 'some narrative'
    end

    within '#referral-information-card' do
      expect(page).to have_content '8/11/2016'
      expect(page).to have_content 'Sacramento'
      expect(page).to have_content '123 fake st'
      expect(page).to have_content 'Springfield'
      expect(page).to have_content 'New York'
      expect(page).to have_content '12345'
      expect(page).to have_content "Child's Home"
      expect(page).to have_content 'Within 24 hours'
      expect(page).to have_content 'Evaluate Out'
    end

    expect(page).to have_link('Home', href: root_path)
    expect(page).to have_link('Edit', href: edit_screening_path(id: existing_screening.id))
  end
end
