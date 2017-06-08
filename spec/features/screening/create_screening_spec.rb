# frozen_string_literal: true

require 'rails_helper'

feature 'Create Screening' do
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
      .and_return(body: new_screening.to_json,
                  status: 201,
                  headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, host_url(ExternalRoutes.intake_api_screenings_path))
      .and_return(body: [].to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, host_url(ExternalRoutes.intake_api_screening_path(1)))
      .and_return(body: new_screening.to_json,
                  status: 200,
                  headers: { 'Content-Type' => 'application/json' })

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
