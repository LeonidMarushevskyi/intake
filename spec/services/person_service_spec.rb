# frozen_string_literal: true
require 'rails_helper'

describe PersonService do
  describe '.create' do
    it 'returns the person if the post to /people is successful' do
      mock_response = double(:mock_response, status: 201, body: {})
      mock_request = double(:mock_request)
      person_attributes = {
        first_name: 'Homer',
        last_name: nil,
        gender: nil,
        date_of_birth: nil,
        ssn: nil,
        address: {
          street_address: '123 fake st',
          city: nil,
          state: nil,
          zip: nil
        }
      }
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with(PersonService::PEOPLE_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(person_attributes.to_json)

      person = PersonService.create(person_attributes)
      expect(person).to eq(mock_response.body)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        PersonService.create({})
      end.to raise_error RuntimeError
    end
  end
end
