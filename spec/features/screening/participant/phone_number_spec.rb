# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Participant Phone Number' do
  let(:marge) do
    FactoryGirl.create(
      :participant,
      :with_complete_phone_number
    )
  end
  let(:screening) { FactoryGirl.create(:screening, participants: [marge]) }

  before do
    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(screening.id)))
      .and_return(json_body(screening.to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_history_of_involvements_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
    stub_request(
      :get,
      host_url(ExternalRoutes.intake_api_relationships_by_screening_path(screening.id))
    ).and_return(json_body([].to_json, status: 200))
  end

  scenario 'editing and then removing a phone number from a participant' do
    visit edit_screening_path(id: screening.id)
    old_phone = marge.phone_numbers.first.number

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector('#phone-numbers')
        expect(page).to have_field('Phone Number', with: marge.phone_numbers.first.number)
        expect(page).to have_field('Phone Number Type', with: marge.phone_numbers.first.type)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
        fill_in 'Phone Number', with: '789-456-1245'
      end

      marge.phone_numbers.first.number = '789-456-1245'

      stub_request(:put, host_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(body: as_json_without_root_id(marge))
        .and_return(json_body(marge.to_json, status: 200))
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, host_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end

    within show_participant_card_selector(marge.id) do
      within '.card-body' do
        expect(page).to have_selector("#phone-number-#{marge.phone_numbers.first.id}")
        expect(page).to have_content('789-456-1245')
        expect(page).to_not have_content(old_phone)
      end

      within '.card-header' do
        click_link 'Edit participant'
      end
    end

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        within '#phone-numbers' do
          click_link 'Delete phone number'
        end

        expect(page).to_not have_content('789-456-1245')
      end
    end

    marge.phone_numbers = []

    stub_request(:put, host_url(ExternalRoutes.intake_api_participant_path(marge.id)))
      .with(body: as_json_without_root_id(marge))
      .and_return(json_body(marge.to_json, status: 200))

    within edit_participant_card_selector(marge.id) do
      within '.card-body' do
        click_button 'Save'
      end
      expect(
        a_request(:put, host_url(ExternalRoutes.intake_api_participant_path(marge.id)))
        .with(json_body(as_json_without_root_id(marge)))
      ).to have_been_made
    end
  end
end

