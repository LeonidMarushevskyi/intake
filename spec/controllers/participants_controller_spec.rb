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
      process :create, method: :post,
                       params: { screening_id: '1', participant: participant_params },
                       format: :json
      expect(JSON.parse(response.body)).to eq(created_participant.as_json)
    end
  end
end
