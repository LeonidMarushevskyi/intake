# frozen_string_literal: true
require 'rails_helper'

describe ReferralsController do
  describe '#create' do
    it 'Creates a new referral' do
      allow(ReferralCreator).to receive(:create).and_return(double(:referral))
      post :create
      assert_response :success
    end
  end
end
