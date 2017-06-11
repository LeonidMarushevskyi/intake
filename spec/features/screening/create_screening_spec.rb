# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

feature 'Create Screening' do
  context 'when release two is enabled' do
    around do |example|
      Feature.run_with_activated(:release_two) do
        example.run
      end
    end

    scenario 'via start screening link' do
      allow(LUID).to receive(:generate).and_return(['DQJIYK'])
      new_screening = FactoryGirl.create(
        :screening,
        reference: 'DQJIYK',
        safety_alerts: [],
        safety_information: nil,
        address: nil
      )
      stub_request(:post, host_url(ExternalRoutes.intake_api_screenings_path))
        .with(body: as_json_without_root_id(new_screening))
        .and_return(json_body(new_screening.to_json, status: 201))

      stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(new_screening.id)))
        .and_return(json_body(new_screening.to_json, status: 200))

      visit root_path
      click_link 'Start Screening'

      expect(
        a_request(
          :post, host_url(ExternalRoutes.intake_api_screenings_path)
        ).with(body: as_json_without_root_id(new_screening))
      ).to have_been_made

      within '#snapshot-card' do
        expect(page).to have_content(
          'The Child Welfare History Snapshot allows you to search CWS/CMS for people and their'
        )
      end
      expect(page).to_not have_content('Edit Screening #DQJIYK')
    end
  end

  scenario 'via start screening link' do
    allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    new_screening = FactoryGirl.build(
      :screening,
      reference: 'DQJIYK',
      safety_alerts: [],
      safety_information: nil,
      address: nil
    )
    stub_request(:post, host_url(ExternalRoutes.intake_api_screenings_path))
      .with(body: as_json_without_root_id(new_screening))
      .and_return(json_body(new_screening.to_json, status: 201))

    stub_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(json_body([].to_json, status: 200))

    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(1)))
      .and_return(json_body(new_screening.to_json, status: 200))

    visit root_path
    click_link 'Start Screening'

    expect(
      a_request(
        :post, host_url(ExternalRoutes.intake_api_screenings_path)
      ).with(body: as_json_without_root_id(new_screening))
    ).to have_been_made
    expect(page).to have_content('Edit Screening #DQJIYK')
  end
end
