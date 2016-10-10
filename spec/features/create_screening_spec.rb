# frozen_string_literal: true
require 'rails_helper'

feature 'Create Screening' do
  scenario 'via start screening link' do
    referral = {
      id: 1,
      reference: 'MYREFERENCE',
      address: {
      },
      involved_people: []
    }.with_indifferent_access

    stub_api_for(Referral) do |stub|
      stub.post('/referrals') do |_env|
        [200, {}, referral.to_json]
      end
      stub.get('/referrals/1') do |_env|
        [200, {}, referral.to_json]
      end
    end

    visit root_path
    click_link 'Start Screening'
    expect(page).to have_content('Edit Referral #MYREFERENCE')
  end
end
