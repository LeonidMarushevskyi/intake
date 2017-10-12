# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Investigations::ContactsController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end
  let(:investigation_id) { '123' }

  describe '#create' do
    let(:response_object) do
      double(
        :response,
        body: '{"id":"444"}',
        status: 201
      )
    end
    let(:contact_params) do
      {
        'started_at' => 'A Date Format',
        'purpose' => '123',
        'status' => 'C',
        'note' => 'This is a note',
        'communication_method' => 'Shouting',
        'location' => 'Somewhere shire'
      }
    end

    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123/contacts', :post, contact_params)
        .and_return(response_object)
    end

    it 'returns response from create contacts API' do
      process :create, method: :post, params: {
        investigation_id: investigation_id,
        contact: contact_params
      }, session: session
      expect(JSON.parse(response.body)).to match a_hash_including('id' => '444')
      expect(response.status).to eq 201
    end
  end

  describe '#show' do
    let(:contact_id) { '456' }
    let(:response_object) do
      double(
        :response,
        body: '{"id":"456"}',
        status: 200
      )
    end
    before do
      expect(FerbAPI).to receive(:make_api_call)
        .with(security_token, '/investigations/123/contacts/456', :get)
        .and_return(response_object)
    end

    it 'returns response from get contacts API' do
      process :show, method: :post, params: {
        investigation_id: investigation_id,
        id: contact_id
      }, session: session
      expect(JSON.parse(response.body)).to match a_hash_including('id' => '456')
      expect(response.status).to eq 200
    end
  end
end
