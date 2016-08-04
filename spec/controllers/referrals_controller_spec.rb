require 'rails_helper'

describe ReferralsController do
  describe 'GET #new' do
    it 'assigns LUID to @refferal_code' do
      get :new
      assert_response :success
      expect(assigns(:referral_code)).to_not be_empty
    end
  end
end
