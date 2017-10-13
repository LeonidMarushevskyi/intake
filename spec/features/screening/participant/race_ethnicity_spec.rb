# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Race & Ethnicity' do
  let(:race_asian) { [{ race: 'Asian', race_detail: 'Hmong' }] }
  let(:race_unknown) { [{ race: 'Unknown', race_detail: nil }] }
  let(:ethnicity_mexican) { { hispanic_latino_origin: 'Yes', ethnicity_detail: ['Mexican'] } }
  let(:ethnicity_declined) do
    { hispanic_latino_origin: 'Declined to answer', ethnicity_detail: [] }
  end
  let(:phone_number) { FactoryGirl.create(:phone_number, number: '1234567890', type: 'Work') }
  let(:marge) do
    FactoryGirl.create(
      :participant,
      middle_name: 'Jacqueline',
      races: race_asian,
      ethnicity: ethnicity_mexican
    )
  end
  let(:homer) do
    FactoryGirl.create(
      :participant,
      middle_name: 'Jay',
      races: race_unknown,
      ethnicity: ethnicity_declined
    )
  end
  let(:expected_marge_as_json) do
    as_json_without_root_id(marge)
      .merge(races: race_unknown.as_json, ethnicity: ethnicity_declined.as_json)
  end
  let(:expected_homer_as_json) do
    as_json_without_root_id(homer)
      .merge(races: race_asian.as_json, ethnicity: ethnicity_mexican.as_json)
  end
  let(:screening) { FactoryGirl.create(:screening, participants: [marge, homer]) }

  before do
    stub_request(:get, intake_api_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(body: as_json_without_root_id(marge))
      .and_return(json_body(marge.to_json, status: 200))
    stub_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(homer.id)))
      .with(body: as_json_without_root_id(homer))
      .and_return(json_body(homer.to_json, status: 200))
    stub_empty_history_for_screening(screening)
    stub_empty_relationships_for_screening(screening)
  end

  context 'when changing to abandoned, unknown, declined' do
    it 'disables and unselects the other checkboxes' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(marge.id) do
        within '#race' do
          expect(find('input[value="Asian"]')).to be_checked
          expect(page).to have_field("participant-#{marge.id}-Asian-race-detail", text: 'Hmong')
          find('label', text: 'Unknown').click
          expect(find('input[value="Unknown"]')).to be_checked
          expect(find('input[value="Asian"]')).to_not be_checked
          expect(find('input[value="Asian"]')).to be_disabled
          expect(page).to_not have_field("participant-#{marge.id}-Asian-race-detail", text: 'Hmong')
        end
        within '#ethnicity' do
          expect(find('input[value="Yes"]')).to be_checked
          expect(page).to have_field("participant-#{marge.id}-ethnicity-detail", text: 'Mexican')
          expect(find('input[value="Declined to answer"]')).to be_disabled
          find('label', text: 'Yes').click
          find('label', text: 'Declined to answer').click
          expect(find('input[value="Declined to answer"]')).to be_checked
          expect(find('input[value="Yes"]')).to be_disabled
          expect(page)
            .to_not have_field("participant-#{marge.id}-ethnicity-detail", text: 'Mexican')
        end

        click_button 'Save'
        expect(
          a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(marge.id)))
          .with(json_body(expected_marge_as_json))
        ).to have_been_made
      end
      within show_participant_card_selector(marge.id) do
        within '.card-body' do
          expect(page).to have_content('Unknown')
          expect(page).to have_content('Declined to answer')
        end
      end
    end
  end

  context 'when changing to race or ethnicity' do
    it 'enables and allows selection of the other checkboxes' do
      visit edit_screening_path(id: screening.id)
      within edit_participant_card_selector(homer.id) do
        within '#race' do
          expect(find('input[value="Unknown"]')).to be_checked
          expect(find('input[value="Asian"]')).to be_disabled
          find('label', text: 'Unknown').click
          find('label', text: 'Asian').click
          select 'Hmong', from: "participant-#{homer.id}-Asian-race-detail"
        end
        within '#ethnicity' do
          expect(find('input[value="Declined to answer"]')).to be_checked
          expect(find('input[value="Yes"]')).to be_disabled
          find('label', text: 'Declined to answer').click
          find('label', text: 'Yes').click
          select 'Mexican', from: "participant-#{homer.id}-ethnicity-detail"
        end

        click_button 'Save'
        expect(
          a_request(:put, intake_api_url(ExternalRoutes.intake_api_participant_path(homer.id)))
          .with(json_body(expected_homer_as_json))
        ).to have_been_made
      end
      within show_participant_card_selector(homer.id) do
        within '.card-body' do
          expect(page).to have_content('Yes - Mexican')
          expect(page).to have_content('Asian - Hmong')
        end
      end
    end
  end
end
