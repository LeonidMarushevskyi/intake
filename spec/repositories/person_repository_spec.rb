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
      expect(described_class.create(new_person)).to eq(created_person)
    end

    it 'raise an error if the response code is not 201' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:post).and_return(mock_response)

      expect do
        described_class.create(nil)
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
      expect(mock_request).to_not receive(:headers)
      expect(mock_request).to_not receive(:body=)
      expect(Person).to receive(:new).with(mock_response.body)
        .and_return(found_person)
      expect(described_class.find(1)).to eq(found_person)
    end

    it 'raise an error if the response code is not 200' do
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:get).and_return(mock_response)

      expect do
        described_class.find(1)
      end.to raise_error('Error finding person')
    end
  end

  describe '.update' do
    it 'returns the person if the put to /people/:id is successful' do
      mock_response = double(:mock_response, status: 200, body: 'mock_body')
      mock_request = double(:mock_request)
      created_person = double(:person, id: '1', as_json: 'created_person')
      updated_person = double(:person)
      allow(API.connection).to receive(:put)
        .and_yield(mock_request)
        .and_return(mock_response)
      expect(mock_request).to receive(:url).with("#{PersonRepository::PEOPLE_PATH}/1")
      expect(mock_request).to receive(:headers).and_return({})
      expect(mock_request).to receive(:body=).with(created_person.to_json)
      expect(Person).to receive(:new).with(mock_response.body)
        .and_return(updated_person)
      expect(described_class.update(created_person)).to eq(updated_person)
    end

    it 'raise an error if the response code is not 201' do
      created_person = double(:person, id: '1')
      mock_response = double(:mock_response, status: 500)
      allow(API.connection).to receive(:put).and_return(mock_response)

      expect do
        described_class.update(created_person)
      end.to raise_error('Error updating person')
    end

    it 'raises an error if person id is not present' do
      created_person = double(:person, id: nil)
      expect do
        described_class.update(created_person)
      end.to raise_error('Error updating person: id is required')
    end
  end

  describe '.search' do
    it 'raise an error if the response code is not 200' do
      stub_request(:get, %r{/api/v1/people_search\?search_term=})
        .and_return(status: 500, headers: { 'Content-Type': 'application/json' })

      expect do
        described_class.search('')
      end.to raise_error('Error searching people')
    end

    it 'returns the people results when people search is successful' do
      results = [{ id: '1' }, { id: '2' }].to_json
      stub_request(:get, %r{/api/v1/people_search\?search_term=FirstName})
        .and_return(body: results, status: 200, headers: { 'Content-Type': 'application/json' })

      expect(described_class.search('FirstName').length).to eq(2)
      expect(described_class.search('FirstName')[0].id).to eq('1')
      expect(described_class.search('FirstName')[1].id).to eq('2')
    end

    it 'sends a GET request to api people search' do
      stub_request(:get, %r{/api/v1/people_search\?search_term=Nothing})
        .and_return(body: [].to_json, status: 200, headers: { 'Content-Type': 'application/json' })

      described_class.search('Nothing')
      expect(a_request(:get, %r{/api/v1/people_search\?search_term=Nothing})).to have_been_made
    end
  end
end
