# frozen_string_literal: true
require 'rails_helper'

describe PersonCreator do
  describe '.create' do
    it 'returns the report if the post to /referrals is successful' do
      mock_response = double(:mock_response, status: 201, body: {})
      mock_request = double(:mock_request)
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with(PersonCreator::PEOPLE_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=)

      person = PersonCreator.create(
        first_name: 'Homer',
        street_address: '123 fake st'
      )
      expect(person).to eq(mock_response.body)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        PersonCreator.create({})
      end.to raise_error RuntimeError
    end
  end
end
