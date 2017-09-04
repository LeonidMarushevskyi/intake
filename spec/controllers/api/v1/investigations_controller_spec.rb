# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::InvestigationsController do
  describe '#screening' do
    let(:security_token) { 'security_token' }
    let(:session) do
      { security_token => security_token }
    end
    let(:investigation_id) { '123' }
    let(:response_object) do
      double(
        :response,
        body: '{"id":"222"}',
        status: 200
      )
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123/screening', :get)
        .and_return(response_object)
    end

    it 'returns response from Ferb screening API' do
      process :screening, method: :get, params: { id: investigation_id }, session: session
      expect(JSON.parse(response.body)).to match a_hash_including('id' => '222')
      expect(response.status).to eq 200
    end
  end
end
