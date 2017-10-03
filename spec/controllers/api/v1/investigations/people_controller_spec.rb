# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Investigations::PeopleController do
  describe '#index' do
    let(:security_token) { 'security_token' }
    let(:session) do
      { security_token => security_token }
    end
    let(:investigation_id) { '123' }
    let(:response_object) do
      double(
        :response,
        body: '[{"name": "Bob"}]',
        status: 200
      )
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123/people', :get)
        .and_return(response_object)
    end

    it 'returns response from Ferb screening API' do
      process :index, method: :get, params: { investigation_id: investigation_id }, session: session
      expect(JSON.parse(response.body)).to match array_including(a_hash_including('name' => 'Bob'))
      expect(response.status).to eq 200
    end
  end
end
