# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ParticipantsController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#create' do
    let(:participant_params) do
      {
        date_of_birth: '05/29/1990',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        addresses: [{
          id: '',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'placement',
          legacy_id: '123456789',
          legacy_source_table: 'ADDR_T'
        }],
        phone_numbers: [
          {
            id: '',
            number: '123-456-7899',
            type: 'Work'
          }
        ],
        legacy_id: '2',
        legacy_source_table: 'CLIENT_T',
        screening_id: '1',
        ssn: '123-23-1234',
        languages: %w[French Farsi]
      }.with_indifferent_access
    end
    let(:created_participant) do
      double(:participant, as_json: participant_params.merge(id: '1'))
    end

    before do
      participant = double(:participant)
      expect(Participant).to receive(:new)
        .with(participant_params).and_return(participant)
      expect(ParticipantRepository).to receive(:create)
        .with(security_token, participant)
        .and_return(created_participant)
    end

    it 'renders a participant as json' do
      process :create,
        method: :post,
        params: { screening_id: '1', participant: participant_params },
        session: session
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
        .with(security_token, participant)
        .and_return(updated_participant)
      process :update, method: :put, params: params, session: session
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_participant.as_json)
    end
  end

  describe '#destroy' do
    let(:participant_id) { '1' }
    before do
      expect(ParticipantRepository).to receive(:delete)
        .with(security_token, participant_id)
        .and_return('')
    end

    it 'deletes an existing participant' do
      process :destroy, method: :delete, params: { id: participant_id }, session: session
      expect(response.body).to be_empty
    end
  end
end
