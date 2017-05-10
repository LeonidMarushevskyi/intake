# frozen_string_literal: true
require 'rails_helper'

describe Api::V1::RelationshipsController do
  let(:screening_id) { '55' }
  let(:security_token) { 'my_security_token' }
  let(:session) { { security_token: security_token } }

  describe '#by_screening_id' do
    let(:expected_json) do
      [
        {
          id: '12',
          first_name: 'Aubrey',
          last_name: 'Campbell',
          relationships: [
            {
              first_name: 'Jake',
              last_name: 'Campbell',
              relationship: 'Sister',
              related_person_id: '7'
            }
          ]
        }
      ].to_json
    end

    before do
      stub_request(:get, %r{api/v1/screenings/#{screening_id}/relationships})
        .with(headers: { 'Authorization' => security_token })
        .and_return(
          body: expected_json,
          status: 200,
          headers: { 'Content-Type' => 'application/json' }
        )
    end

    it 'responds with success' do
      process :by_screening_id,
        method: :get,
        params: { id: screening_id },
        session: session
      expect(JSON.parse(response.body)).to match array_including(
        a_hash_including(
          'id' => '12',
          'first_name' => 'Aubrey',
          'last_name' => 'Campbell',
          'relationships' => array_including(
            a_hash_including(
              'first_name' => 'Jake',
              'last_name' => 'Campbell',
              'relationship' => 'Sister',
              'related_person_id' => '7'
            )
          )
        )
      )
    end
  end
end
