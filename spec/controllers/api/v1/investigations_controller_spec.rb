# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::InvestigationsController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end
  let(:investigation_id) { '123' }

  describe '#screening' do
    let(:screening_response) do
      double(
        :response,
        body: '{"id":"222"}',
        status: 200
      )
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123/screening', :get)
        .and_return(screening_response)
    end

    it 'returns response from Ferb screening API' do
      process :screening, method: :get, params: { id: investigation_id }, session: session
      expect(JSON.parse(response.body)).to match a_hash_including('id' => '222')
      expect(response.status).to eq 200
    end
  end

  describe '#show' do
    let(:investigation_response) do
      double(
        :response,
        body: '{"id":"123"}',
        status: 200
      )
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123', :get)
        .and_return(investigation_response)
    end

    it 'returns response from Ferb investigation API' do
      process :show, method: :get, params: { id: investigation_id }, session: session
      expect(JSON.parse(response.body)).to match a_hash_including('id' => '123')
      expect(response.status).to eq 200
    end
  end
end
