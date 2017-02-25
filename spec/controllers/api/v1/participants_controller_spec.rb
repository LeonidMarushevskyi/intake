# frozen_string_literal: true
require 'rails_helper'

describe Api::V1::ParticipantsController do
  describe '#create' do
    let(:participant_params) do
      {
        date_of_birth: '05/29/1990',
        first_name: 'Homer',
        gender: 'male',
        last_name: 'Simpson',
        addresses: [{
          id: '',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'placement'
        }],
        person_id: '2',
        screening_id: '1',
        ssn: '123-23-1234'
      }.with_indifferent_access
    end
    let(:created_participant) do
      double(:participant, as_json: participant_params.merge(id: '1'))
    end

    describe 'unsuccessful due to API timeout' do
      it 'renders a JSON error if there\'s there is a problem creating the participant' do
        stub_request(:post, api_participants_path)
          .with(body: {})
          .to_timeout

        process :create, method: :post,
                         params: { participant: participant_params },
                         format: :json

        expected_exception = {
          'error': 'api_error',
          'status': 'N/A',
          'message': 'execution expired',
          'api_response_body': 'N/A',
          'method': 'post',
          'url': '/api/v1/participants'
        }

        body_as_hash = JSON.parse(response.body)
        expect(body_as_hash['sent_attributes']).to be_present
        expect(body_as_hash.except('sent_attributes')).to eq(expected_exception.as_json)
      end
    end

    describe 'unsuccessful due to an API error' do
      it 'renders a JSON error if there\'s an error on the api, appends extra api info' do
        stub_request(:post, api_participants_path)
          .with(body: {})
          .and_return(body: 'this is not json',
                      status: 500,
                      headers: { 'Content-Type' => 'application/json' })

        process :create, method: :post,
                         params: { participant: participant_params },
                         format: :json

        expected_exception = {
          'error': 'api_error',
          'status': 500,
          'message': "784: unexpected token at 'this is not json'",
          'api_response_body': 'this is not json',
          'method': 'post',
          'url': '/api/v1/participants'
        }

        body_as_hash = JSON.parse(response.body)
        expect(body_as_hash['sent_attributes']).to be_present
        expect(body_as_hash.except('sent_attributes')).to eq(expected_exception.as_json)
      end
    end

    describe 'successful' do
      before do
        participant = double(:participant)
        expect(Participant).to receive(:new)
          .with(participant_params).and_return(participant)
        expect(ParticipantRepository).to receive(:create).with(participant)
          .and_return(created_participant)
      end

      it 'renders a participant as json' do
        process :create, method: :post,
                         params: { screening_id: '1', participant: participant_params },
                         format: :json
        expect(JSON.parse(response.body)).to eq(created_participant.as_json)
      end
    end
  end

  describe '#destroy' do
    before do
      expect(ParticipantRepository).to receive(:delete).with('1')
        .and_return('')
    end

    it 'deletes an existing participant' do
      process :destroy, method: :delete,
                        params: { id: '1' },
                        format: :json
      expect(response.body).to be_empty
    end
  end
end
