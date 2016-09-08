# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Referrals Index' do
  scenario 'list all referrals' do
    referral_one = {
      id: 1,
      reference: 'ABCDEF',
      incident_date: '2016-08-11',
      name: 'Little Shop Of Horrors',
      response_time: ResponseTime::ALL.keys.sample,
      screening_decision: ScreeningDecision::ALL.keys.sample
    }.with_indifferent_access
    referral_two = {
      id: 2,
      reference: 'HIJKLM',
      incident_date: '2016-7-7',
      name: 'The Shining',
      response_time: ResponseTime::ALL.keys.sample,
      screening_decision: ScreeningDecision::ALL.keys.sample
    }.with_indifferent_access
    referral_three = {
      id: 3,
      reference: 'NOPQRS',
      incident_date: '2016-08-10',
      name: 'It Follows',
      response_time: ResponseTime::ALL.keys.sample,
      screening_decision: ScreeningDecision::ALL.keys.sample
    }.with_indifferent_access
    referrals = [referral_one, referral_two, referral_three]

    stub_api_for(Referral) do |stub|
      stub.get('/referrals') do |_env|
        [200, {}, referrals.to_json]
      end
    end

    visit referrals_path

    within 'thead' do
      expect(page).to have_css('th', text: 'Name & ID')
      expect(page).to have_css('th', text: 'Response Time')
      expect(page).to have_css('th', text: 'Decision')
      expect(page).to have_css('th', text: 'Report Date')
    end
  end
end
