# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Referral' do
  scenario 'edit an existing referral' do
    referral = {
      id: 1,
      reference: 'My Bad!'
    }.with_indifferent_access

    stub_api_for(Referral) do |stub|
      stub.get('/referrals/1') do |_env|
        [200, {}, referral.to_json]
      end
    end

    visit edit_referral_path(id: 1)
    expect(page).to have_content 'Referral #My Bad!'
  end
end
