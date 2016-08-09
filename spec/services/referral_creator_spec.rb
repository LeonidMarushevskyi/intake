require 'rails_helper'

describe ReferralCreator do
  describe '.create' do
    it 'returns the report attributes if the post to /referrals is successful' do
      mock_response = double(:mock_response, status: 201, body: double)
      allow(API.connection).to receive(:post).and_return(mock_response)
      referral = ReferralCreator.create
      expect(referral).to eq(mock_response.body)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect {
        ReferralCreator.create
      }.to raise_error RuntimeError
    end
  end
end
