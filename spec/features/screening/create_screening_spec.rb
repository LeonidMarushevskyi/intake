# frozen_string_literal: true
require 'rails_helper'

feature 'Create Screening' do
  scenario 'via start screening link' do
    allow(LUID).to receive(:generate).and_return(['DQJIYK'])
    new_screening = FactoryGirl.build(
      :screening,
      created_at: nil,
      id: nil,
      reference: 'DQJIYK',
      updated_at: nil,
      address: nil
    )
    faraday_helper do |stub|
      stub.post('/api/v1/screenings', new_screening.to_json) do |_|
        [201, {}, new_screening.as_json.merge(id: 1, address: {})]
      end
      stub.get('/api/v1/screenings/1') do |_|
        [200, {}, new_screening.as_json.merge(id: 1, address: {})]
      end
    end

    visit root_path
    click_link 'Start Screening'
    expect(page).to have_content('Edit Screening #DQJIYK')
  end
end
