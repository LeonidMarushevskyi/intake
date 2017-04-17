# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'
require 'support/factory_girl'

feature 'screening incident information card' do
  let(:existing_screening) do
    FactoryGirl.create(
      :screening,
      incident_county: 'colusa',
      incident_date: '2016-08-11',
      address: FactoryGirl.create(
        :address,
        city: 'Springfield',
        state: 'NY',
        street_address: '123 fake st',
        zip: '12345'
      ),
      location_type: "Child's Home",
      report_narrative: 'Some kind of narrative'
    )
  end

  before(:each) do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit edit_screening_path(id: existing_screening.id)
  end

  scenario 'screening<->address edit merging should not override unchanged values' do
    existing_screening.address.assign_attributes(
      street_address: '33 Whatever'
    )
    stub_request(:put, intake_api_screening_url(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))
    within '#incident-information-card.edit' do
      fill_in 'Address', with: '33 Whatever Rd'
      find_field('street_address').send_keys [:backspace, :backspace, :backspace]
      click_button 'Save'
      expect(
        a_request(:put, intake_api_screening_url(existing_screening.id))
        .with(json_body(as_json_without_root_id(existing_screening)))
      ).to have_been_made
    end
  end

  scenario 'user edits incident card from screening edit page and saves' do
    within '#incident-information-card.edit' do
      expect(page).to have_field('Incident Date', with: '2016-08-11')
      expect(page).to have_field('Incident County', with: 'colusa')
      expect(page).to have_field('Location Type', with: "Child's Home")
      expect(page).to have_field('Address', with: '123 fake st')
      expect(page).to have_field('City', with: 'Springfield')
      expect(page).to have_field('State', with: 'NY')
      expect(page).to have_field('Zip', with: '12345')
      fill_in 'Incident Date', with: '2015-10-05'
    end

    within '#narrative-card.edit' do
      fill_in 'Report Narrative', with: 'Should persist in the form'
    end

    existing_screening.assign_attributes(incident_date: '2015-10-05')
    stub_request(:put, intake_api_screening_url(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
      .and_return(json_body(existing_screening.to_json))

    within '#incident-information-card.edit' do
      click_button 'Save'
    end

    expect(
      a_request(:put, intake_api_screening_url(existing_screening.id))
      .with(json_body(as_json_without_root_id(existing_screening)))
    ).to have_been_made

    within '#incident-information-card.show' do
      expect(page).to have_content('10/05/2015')
      expect(page).to have_content('Colusa')
      expect(page).to have_content('Springfield')
      expect(page).to have_content("Child's Home")
      expect(page).to have_content('123 fake st')
      expect(page).to have_content('Springfield')
      expect(page).to have_content('New York')
      expect(page).to have_content('12345')
    end

    within '#narrative-card.edit' do
      expect(page).to have_content('Should persist in the form')
    end
  end
end
