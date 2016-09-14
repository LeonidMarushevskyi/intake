# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Referrals Index' do
  scenario 'list all referrals' do
    referral_one = {
      id: 1,
      reference: 'ABCDEF',
      created_at: '2016-08-11T18:24:22.157Z',
      name: 'Little Shop Of Horrors',
      response_time: 'immediate',
      screening_decision: 'evaluate_out'
    }.with_indifferent_access
    referral_two = {
      id: 2,
      reference: 'HIJKLM',
      created_at: '2016-07-07T11:21:22.007Z',
      name: 'The Shining',
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation'
    }.with_indifferent_access
    referral_three = {
      id: 3,
      reference: 'NOPQRS',
      created_at: '2016-08-10T06:11:22.112Z',
      name: 'It Follows',
      response_time: 'more_than_twenty_four_hours',
      screening_decision: 'referral_to_other_agency'
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

    within 'tbody' do
      expect(page).to have_link('Little Shop Of Horrors - ABCDEF')
      expect(page).to have_content('Immediate')
      expect(page).to have_content('Evaluate Out')
      expect(page).to have_content('08/11/2016')

      expect(page).to have_link('The Shining - HIJKLM')
      expect(page).to have_content('Within 24 hours')
      expect(page).to have_content('Accept for Investigation')
      expect(page).to have_content('07/07/2016')

      expect(page).to have_link('It Follows - NOPQRS')
      expect(page).to have_content('More than 24 hours')
      expect(page).to have_content('Referral to Other Agency')
      expect(page).to have_content('08/10/2016')

      expect(page).to have_xpath('tr', count: 3)
    end
  end
end
