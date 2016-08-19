# frozen_string_literal: true
require 'rails_helper'

describe ReferralsController do
  describe '#create' do
    it 'Creates a new referral' do
      referral = { 'reference' => '123ABC' }
      allow(ReferralCreator).to receive(:create).and_return(referral)
      post :create
      assert_response :redirect
    end
  end
end
