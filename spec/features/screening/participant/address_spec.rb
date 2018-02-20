# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Participant Address' do
  let(:marge) {FactoryGirl.create(:participant)}
  let(:screening) {FactoryGirl.create(:screening, participants: [marge])}
  before do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
        .and_return(json_body(screening.to_json, status: 200))
    stub_request(
        :put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id))
    ).and_return(json_body(marge.to_json, status: 200))
    stub_empty_relationships_for_screening(screening)
    stub_empty_history_for_screening(screening)
  end

  scenario 'adding a new address to a participant' do
    visit edit_screening_path(id: screening.id)

    within edit_participant_card_selector(marge.id) do
      click_button 'Add new address'

      within all('.row.list-item').last do
        fill_in 'Address', with: '1234 Some Lane'
        fill_in 'City', with: 'Someplace'
        select 'California', from: 'State'
        fill_in 'Zip', with: '55555'
        select 'Home', from: 'Address Type'
      end

      click_button 'Save'
    end

    expect(a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
               .with(body: hash_including(
                   'addresses' => array_including(
                       hash_including(
                           'id' => nil,
                           'street_address' => '1234 Some Lane',
                           'city' => 'Someplace',
                           'state' => 'CA',
                           'zip' => '55555',
                           'type' => '32'
                       )
                   )
               ))
    ).to have_been_made
  end

  scenario 'list of address types is correct' do
    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(marge.id) do
      click_button 'Add new address'
      expect(page).to have_select('Address Type', :options => [
          '',
          'Common',
          'Day Care',
          'Home',
          'Homeless',
          'Other',
          'Penal Institution',
          'Permanent Mailing Address',
          'Residence 2',
          'Work'])

    end
  end
end

