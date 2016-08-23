# frozen_string_literal: true
require 'rails_helper'

feature 'Create Referral' do
  scenario 'via create referral link' do
    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.post('/api/v1/referrals') do |request|
          params = JSON.parse(request.body)
          [201, {}, { 'reference' => params['reference'], 'id' => 1 }]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

    referral = {
      id: 1,
      reference: 'MYREFERENCE'
    }.with_indifferent_access

    stub_api_for(Referral) do |stub|
      stub.get('/referrals/1') do |_env|
        [200, {}, referral.to_json]
      end
    end

    visit root_path
    click_link 'Create Referral'
    expect(page).to have_content('Referral #MYREFERENCE')
  end
end
