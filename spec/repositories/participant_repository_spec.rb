# frozen_string_literal: true
require 'rails_helper'

describe ParticipantRepository do
  let(:mock_response) { double(:mock_response, status: status, body: 'mock_body') }
  let(:mock_request) { double(:mock_request) }

  describe '.create' do
    let(:status) { 201 }
    let(:new_participant) { FactoryGirl.build(:participant) }
    let(:created_participant) { double(:participant) }

    before :each do
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
    end

    it 'returns the participant if the post to /participants is successful' do
      expect(mock_request).to receive(:url).with(ParticipantRepository::PARTICIPANTS_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(new_participant.to_json(except: :id))
      expect(Participant).to receive(:new).with(mock_response.body)
        .and_return(created_participant)
      expect(ParticipantRepository.create(new_participant)).to eq(created_participant)
    end
  end

  describe '.delete' do
    it 'deletes the participant if the delete to /participants/id is successful' do
      stub_request(:delete, %r{/api/v1/participants/\d})
        .and_return(status: 204, headers: { 'Content-Type': 'application/json' })
      described_class.delete('1')
      expect(a_request(:delete, %r{/api/v1/participants/1})).to have_been_made
    end
  end

  describe '.update' do
    let(:status) { 200 }
    let(:participant) do
      participant = FactoryGirl.create(:participant)
      participant.first_name = 'My New First Name'
      participant
    end
    let(:updated_participant) { double(:participant) }
    let(:expected_url) { "#{ParticipantRepository::PARTICIPANTS_PATH}/#{participant.id}" }
    let(:expected_body) do
      participant_hash = participant.to_h
      participant_without_id = participant_hash.tap { |participant| participant.delete(:id) }
      participant_without_id.to_json
    end

    before :each do
      allow(API.connection).to receive(:put)
        .and_yield(mock_request)
        .and_return(mock_response)
    end

    it 'returns the updated participant if the put to /participants/id is successful' do
      expect(mock_request).to receive(:url).with(expected_url)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(expected_body)
      expect(Participant).to receive(:new).with(mock_response.body)
        .and_return(updated_participant)
      expect(ParticipantRepository.update(participant)).to eq(updated_participant)
    end
  end
end
