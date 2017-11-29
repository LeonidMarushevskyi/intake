# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::UserController do
  let(:security_token) { 'security_token' }
  let(:staff) { FactoryGirl.build(:staff, staff_id: '123') }
  let(:session) do
    {
      'user_details' => staff
    }
  end

  describe 'when the information from the user is on the session' do
    it 'returns the data on get' do
      process :user_info, method: :get, session: session
      expect(response.status).to eq(200)
      expect(response.body).to eq(staff.to_json)
    end
  end

  describe 'when the information from the user is not on the session, return empty json' do
    it 'returns nil' do
      process :user_info, method: :get, session: nil
      expect(response.status).to eq(200)
      expect(response.body).to eq({}.to_json)
    end
  end
end
