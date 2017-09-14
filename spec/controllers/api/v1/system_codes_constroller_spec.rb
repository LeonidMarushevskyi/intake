# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::SystemCodesController do
  describe '#index' do
    let(:security_token) { 'security_token' }
    let(:session) do
      { security_token => security_token }
    end
    let(:response_object) do
      double(
        :response,
        body: [{ 'code' => '123', 'value' => 'abc' }],
        status: 200
      )
    end
    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/lov', :get)
        .and_return(response_object)
    end

    it 'returns response from Ferb LOV API' do
      process :index, method: :get, session: session, as: :json
      expect(JSON.parse(response.body)).to match array_including(
        a_hash_including('code' => '123', 'value' => 'abc')
      )
      expect(response.status).to eq 200
    end
  end
end
