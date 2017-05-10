# frozen_string_literal: true

require 'rails_helper'

describe PersonRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:person_id) { '11' }
    let(:response) { double(:response, body: { 'id' => person_id, 'first_name' => 'New Person' }) }
    let(:person) { { id: nil, first_name: 'New Person' } }

    before do
      expect(API).to receive(:make_api_call)
        .with(security_token, '/api/v1/people', :post, 'first_name' => 'New Person')
        .and_return(response)
    end

    it 'returns the created person' do
      created_person = described_class.create(security_token, person)
      expect(created_person.id).to eq(person_id)
      expect(created_person.first_name).to eq('New Person')
    end
  end

  describe '.find' do
    let(:person_id) { '66' }
    let(:response) do
      double(:response, body: { 'id' => person_id, 'first_name' => 'Existing Person' })
    end

    before do
      expect(API).to receive(:make_api_call)
        .with(security_token, "/api/v1/people/#{person_id}", :get)
        .and_return(response)
    end

    it 'returns the existing person' do
      existing_person = described_class.find(security_token, person_id)
      expect(existing_person.id).to eq(person_id)
      expect(existing_person.first_name).to eq('Existing Person')
    end
  end

  describe '.update' do
    let(:response) do
      double(:response, body: { 'id' => person_id, 'first_name' => 'Updated Person' })
    end
    let(:person) do
      Person.new(id: person_id, first_name: 'Updated Person')
    end

    context 'when person has an id' do
      let(:person_id) { '77' }

      before do
        expect(API).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v1/people/#{person_id}",
            :put,
            person.as_json(except: :id)
          )
          .and_return(response)
      end

      it 'returns the updated person' do
        updated_person = described_class.update(security_token, person)
        expect(updated_person.id).to eq(person_id)
        expect(updated_person.first_name).to eq('Updated Person')
      end
    end

    context 'when person has no id' do
      let(:person_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(security_token, person)
        end.to raise_error('Error updating person: id is required')
      end
    end
  end
end
