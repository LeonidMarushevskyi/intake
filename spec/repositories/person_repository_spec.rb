# frozen_string_literal: true
require 'rails_helper'

describe PersonRepository do
  describe '.create' do
    it 'returns the person if the post to /people is successful' do
      mock_response = double(:mock_response, status: 201, body: 'mock_body')
      mock_request = double(:mock_request)
      new_person = double(:person, to_json: 'new_person')
      created_person = double(:person)
      allow(API.connection).to receive(:post)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with(PersonRepository::PEOPLE_PATH)
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(new_person.to_json)
      expect(Person).to receive(:new).with(mock_response.body)
        .and_return(created_person)
      expect(PersonRepository.create(new_person)).to eq(created_person)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        PersonRepository.create(nil)
      end.to raise_error('Error creating person')
    end
  end

  describe '.find' do
    it 'returns the person if the get request to /people/:id is successful' do
      mock_response = double(:mock_response, status: 200, body: 'mock_body')
      mock_request = double(:mock_request)
      found_person = double(:person)
      allow(API.connection).to receive(:get)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with("#{PersonRepository::PEOPLE_PATH}/1")
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to_not receive(:body=)
      expect(Person).to receive(:new).with(mock_response.body)
        .and_return(found_person)
      expect(PersonRepository.find(1)).to eq(found_person)
    end

    it 'raise an error if the response code is not 200' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:get).and_return(mock_response)

      expect do
        PersonRepository.find(1)
      end.to raise_error('Error finding person')
    end
  end

  describe '.update' do
    it 'returns the person if the put to /people/:id is successful' do
      mock_response = double(:mock_response, status: 200, body: 'mock_body')
      mock_request = double(:mock_request)
      created_person = double(:person, id: 1, as_json: 'created_person')
      updated_person = double(:person)
      allow(API.connection).to receive(:put)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with("#{PersonRepository::PEOPLE_PATH}/1")
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(created_person.to_json)
      expect(Person).to receive(:new).with(mock_response.body)
        .and_return(updated_person)
      expect(PersonRepository.update(created_person)).to eq(updated_person)
    end

    it 'raise an error if the response code is not 201' do
      created_person = double(:person, id: 1)
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:put).and_return(mock_response)

      expect do
        PersonRepository.update(created_person)
      end.to raise_error('Error updating person')
    end

    it 'raises an error if person id is not present' do
      created_person = double(:person, id: nil)
      expect do
        PersonRepository.update(created_person)
      end.to raise_error('Error updating person: id is required')
    end
  end
end
