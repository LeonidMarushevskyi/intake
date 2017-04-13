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
        phone_numbers: [
          {
            id: '',
            number: '123-456-7899',
            type: 'Work'
          }
        ],
        person_id: '2',
        screening_id: '1',
        ssn: '123-23-1234'
      }.with_indifferent_access
    end
    let(:created_participant) do
      double(:participant, as_json: participant_params.merge(id: '1'))
    end

    before do
      participant = double(:participant)
      expect(Participant).to receive(:new)
        .with(participant_params).and_return(participant)
      expect(ParticipantRepository).to receive(:create).with(participant)
        .and_return(created_participant)
    end

    it 'renders a participant as json' do
      process :create,
        method: :post,
        params: { screening_id: '1', participant: participant_params },
        format: :json
      expect(JSON.parse(response.body)).to eq(created_participant.as_json)
    end
  end

  describe '#update' do
    let(:participant_params) do
      {
        id: '1',
        first_name: 'Marge',
        last_name: 'Simpson',
        roles: ['Victim']
      }
    end
    let(:params) do
      {
        id: participant_params[:id],
        participant: participant_params
      }
    end
    let(:participant) { double(:participant) }
    let(:updated_participant) { double(:participant, as_json: { 'id' => 'updated_participant' }) }

    it 'updates and renders participant as json' do
      expect(Participant).to receive(:new).with(participant_params).and_return(participant)
      expect(ParticipantRepository).to receive(:update)
        .with(participant).and_return(updated_participant)
      process :update, method: :put, params: params, format: :json
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_participant.as_json)
    end
  end

  describe '#destroy' do
    before do
      expect(ParticipantRepository).to receive(:delete).with('1')
        .and_return('')
    end

    it 'deletes an existing participant' do
      process :destroy,
        method: :delete,
        params: { id: '1' },
        format: :json
      expect(response.body).to be_empty
    end
  end
end
