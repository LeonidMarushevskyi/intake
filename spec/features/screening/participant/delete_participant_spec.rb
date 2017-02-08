# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Delete Participant' do
  let(:participant) do
    FactoryGirl.build(
      :participant,
      date_of_birth: 15.years.ago.to_date.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234',
      person_id: 1
    )
  end
  let(:screening) do
    FactoryGirl.build(
      :screening,
      participants: [participant]
    )
  end

  scenario 'removing a participant from an existing screening' do
    stub_request(:get, api_screening_path(screening.id))
      .and_return(
        body: screening.to_json,
        status: 200,
        headers: { 'Content-Type' => 'application/json' }
      )
    stub_request(:delete, api_participant_path(participant.id))
      .and_return(status: 200, headers: { 'Content-Type' => 'application/json' })

    visit edit_screening_path(id: screening.id)
    within edit_participant_card_selector(participant.id) do
      within '.card-header' do
        click_link 'Delete participant'
      end
    end
    expect(a_request(:delete, api_participant_path(participant.id))).to have_been_made
    expect(page).to_not have_css(edit_participant_card_selector(participant.id))
  end
end
