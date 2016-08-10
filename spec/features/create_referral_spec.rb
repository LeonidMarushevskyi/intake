# frozen_string_literal: true
require 'rails_helper'

feature 'Create Referral' do
  scenario 'via create referral link' do
    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.post('/api/v1/referrals') do |_|
          [201, {}, { 'reference' => 'ABC123' }]
        end
      end
    end

    allow(API).to receive(:connection).and_return(faraday_stub)
    visit root_path

    click_link 'Create Referral'

    expect(page.text).to match(/Referral #([0-9a-zA-Z].*)/)
  end
end
