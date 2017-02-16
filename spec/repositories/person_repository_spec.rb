# frozen_string_literal: true
require 'rails_helper'

describe PersonRepository do
  describe '.create' do
    it 'returns the person if the post to /people is successful' do
      new_person = FactoryGirl.build(:person, first_name: 'Homer')
      new_person_attributes = new_person.to_json(except: :id)
      stub_request(:post, %r{/api/v1/people})
        .with(body: new_person_attributes)
        .and_return(
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: new_person.to_json
        )
      expect(described_class.create(new_person).id).to eq(new_person.id)
      expect(a_request(:post, %r{/api/v1/people}).with(body: new_person_attributes)).to have_been_made
    end

    it 'raise an error if the response code is not 201' do
      stub_request(:post, %r{/api/v1/people}).and_return(status: 500)
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
      existing_person = FactoryGirl.build(:person, first_name: 'Homer')
      existing_person_attributes = existing_person.to_json(except: :id)
      stub_request(:put, %r{/api/v1/people/#{existing_person.id}})
        .with(body: existing_person_attributes)
        .and_return(
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: existing_person.to_json
        )
      expect(described_class.update(existing_person).id).to eq(existing_person.id)
      expect(a_request(:put, %r{/api/v1/people}).with(body: existing_person_attributes)).to have_been_made
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
