# frozen_string_literal: true
require 'rails_helper'

describe ParticipantRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:participant_id) { '11' }
    let(:response) do
      double(:response, body: { 'id' => participant_id, 'first_name' => 'New Participant' })
    end
    let(:participant) do
      double(:participant, as_json: { 'id' => nil, 'first_name' => 'New Participant' })
    end

    before do
      expect(API).to receive(:make_api_call)
        .with(security_token, '/api/v1/participants', :post, 'first_name' => 'New Participant')
        .and_return(response)
    end

    it 'returns the created participant' do
      created_participant = described_class.create(security_token, participant)
      expect(created_participant.id).to eq(participant_id)
      expect(created_participant.first_name).to eq('New Participant')
    end
  end

  describe '.delete' do
    let(:participant_id) { '22' }

    it 'makes a DELETE API call to participants' do
      expect(API).to receive(:make_api_call)
        .with(security_token, "/api/v1/participants/#{participant_id}", :delete)
      described_class.delete(security_token, participant_id)
    end
  end

  describe '.update' do
    let(:response) do
      double(:response, body: { 'id' => participant_id, 'first_name' => 'Updated Participant' })
    end
    let(:participant) do
      double(
        :participant,
        id: participant_id,
        as_json: { 'id' => participant_id, 'first_name' => 'Updated Participant' }
      )
    end

    context 'when participant has an id' do
      let(:participant_id) { '91' }

      before do
        expect(API).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v1/participants/#{participant_id}",
            :put,
            'first_name' => 'Updated Participant'
          )
          .and_return(response)
      end

      it 'returns the updated participant' do
        updated_participant = described_class.update(security_token, participant)
        expect(updated_participant.id).to eq(participant_id)
        expect(updated_participant.first_name).to eq('Updated Participant')
      end
    end

    context 'when participant has no id' do
      let(:participant_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(security_token, participant)
        end.to raise_error('Error updating participant: id is required')
      end
    end
  end
end
