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
      expect(a_request(:post, %r{/api/v1/people})
        .with(body: new_person_attributes)).to have_been_made
    end

    it 'raise an error if the response code is not 201' do
      stub_request(:post, %r{/api/v1/people}).and_return(status: 500)
      expect do
        described_class.create(nil)
      end.to raise_error(ApiError)
    end
  end

  describe '.find' do
    it 'returns the person if the get request to /people/:id is successful' do
      mock_response = double(:mock_response, status: 200, body: 'mock_body')
      mock_request = double(:mock_request)
      found_person = double(:person)
      allow(API.intake_api_connection).to receive(:get)
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
      stub_request(:get, %r{/api/v1/people/\d}).and_return(status: 500)
      expect do
        described_class.find(1)
      end.to raise_error(ApiError)
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
      expect(a_request(:put, %r{/api/v1/people}).with(body: existing_person_attributes))
        .to have_been_made
    end

    it 'raise an error if the response code is not 201' do
      existing_person = FactoryGirl.build(:person, first_name: 'Homer')
      existing_person_attributes = existing_person.to_json(except: :id)

      stub_request(:put, %r{/api/v1/people/#{existing_person.id}})
        .with(body: existing_person_attributes)
        .and_return(status: 500)

      expect do
        described_class.update(existing_person)
      end.to raise_error(ApiError)
    end

    it 'raises an error if person id is not present' do
      created_person = double(:person, id: nil)
      expect do
        described_class.update(created_person)
      end.to raise_error('Error updating person: id is required')
    end
  end
end
