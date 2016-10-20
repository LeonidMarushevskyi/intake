# frozen_string_literal: true
require 'rails_helper'

describe ScreeningRepository do
  describe '.create' do
    it 'returns the screening if the post to /screenings is successful' do
      mock_response = double(:mock_response, status: 201, body: 'mock_body')
      mock_request = double(:mock_request)
      new_screening = double(:screening, to_json: 'new_screening')
      created_screening = double(:screening)
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with(ScreeningRepository::SCREENING_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(new_screening.to_json)
      expect(Screening).to receive(:new).with(mock_response.body)
        .and_return(created_screening)
      expect(ScreeningRepository.create(new_screening)).to eq(created_screening)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        ScreeningRepository.create(nil)
      end.to raise_error('Error creating screening')
    end
  end

  describe '.find' do
    it 'returns the screening if the get request to /screenings/:id is successful' do
      mock_response = double(:mock_response, status: 200, body: 'mock_body')
      mock_request = double(:mock_request)
      found_screening = double(:screening)
      allow(API.connection).to receive(:get)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with("#{ScreeningRepository::SCREENING_PATH}/1")
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to_not receive(:body=)
      expect(Screening).to receive(:new).with(mock_response.body)
        .and_return(found_screening)
      expect(ScreeningRepository.find(1)).to eq(found_screening)
    end

    it 'raise an error if the response code is not 200' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:get).and_return(mock_response)

      expect do
        ScreeningRepository.find(1)
      end.to raise_error('Error finding screening')
    end
  end
end
