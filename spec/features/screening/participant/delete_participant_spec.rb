# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Delete Participant' do
  let(:participant) do
    FactoryGirl.create(
      :participant,
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      legacy_id: 1
    )
  end
  let(:screening) { FactoryGirl.create(:screening, participants: [participant]) }

  scenario 'removing a participant from an existing screening in edit mode' do
    stub_request(:get, intake_api_screening_url(screening.id))
      .and_return(
        body: screening.to_json,
        status: 200,
        headers: { 'Content-Type' => 'application/json' }
      )
    stub_request(
      :get,
      intake_api_history_of_involvements_url(screening.id)
    ).and_return(json_body([].to_json, status: 200))
    stub_request(:delete, intake_api_participant_url(participant.id))
      .and_return(status: 204, headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(participant.id) do
      within '.card-header' do
        click_button 'Delete participant'
      end
    end
    expect(a_request(:delete, intake_api_participant_url(participant.id))).to have_been_made
    expect(page).to_not have_css(edit_participant_card_selector(participant.id))
  end

  scenario 'removing a participant from an existing screening in show mode' do
    stub_request(:get, intake_api_screening_url(screening.id))
      .and_return(
        body: screening.to_json,
        status: 200,
        headers: { 'Content-Type' => 'application/json' }
      )
    stub_request(
      :get,
      intake_api_history_of_involvements_url(screening.id)
    ).and_return(json_body([].to_json, status: 200))
    stub_request(:delete, intake_api_participant_url(participant.id))
      .and_return(status: 204, headers: { 'Content-Type' => 'application/json' })

    visit screening_path(id: screening.id)
    within show_participant_card_selector(participant.id) do
      within '.card-header' do
        click_button 'Delete participant'
      end
    end
    expect(a_request(:delete, intake_api_participant_url(participant.id))).to have_been_made
    expect(page).to_not have_css(show_participant_card_selector(participant.id))
  end
end
