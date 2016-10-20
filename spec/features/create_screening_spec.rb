# frozen_string_literal: true
require 'rails_helper'

feature 'Create Screening' do
  scenario 'via start screening link' do
    new_screening = {
     communication_method: nil,
     created_at: nil,
     ended_at: nil,
     id: nil,
     incident_county: nil,
     incident_date: nil,
     location_type: nil,
     name: nil,
     reference: "DQJIYK",
     report_narrative: nil,
     response_time: nil,
     screening_decision: nil,
     started_at: nil,
     updated_at: nil,
     address: nil,
     participants: [],
     participant_ids: []
    }

    created_screening = new_screening
      .merge(id: 1).merge(address: {})
    allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.post('/api/v1/screenings', new_screening.to_json) do |_|
          [201, {}, created_screening]
        end
        stub.get('/api/v1/screenings/1') do |_|
          [200, {}, created_screening]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

    visit root_path
    click_link 'Start Screening'
    expect(page).to have_content('Edit Screening #DQJIYK')
  end
end
