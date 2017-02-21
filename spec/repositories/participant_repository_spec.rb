# frozen_string_literal: true
require 'rails_helper'

describe ParticipantRepository do
  describe '.create' do
    it 'returns the participant if the post to /participants is successful' do
      mock_response = double(:mock_response, status: 201, body: 'mock_body')
      mock_request = double(:mock_request)
      new_participant = FactoryGirl.build(:participant)
      created_participant = double(:participant)
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with(ParticipantRepository::PARTICIPANTS_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(new_participant.to_json(except: :id))
      expect(Participant).to receive(:new).with(mock_response.body)
        .and_return(created_participant)
      expect(ParticipantRepository.create(new_participant)).to eq(created_participant)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        ParticipantRepository.create(nil)
      end.to raise_error('Error creating participant')
    end
  end
end
