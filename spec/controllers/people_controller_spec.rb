# frozen_string_literal: true
require 'rails_helper'

describe PeopleController do
  describe '#new' do
    it 'renders the show template' do
      process :new, method: :get
      expect(response).to render_template('show')
    end
  end

  describe '#create' do
    let(:person_params) do
      {
        id: '',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          id: '',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        },
        phone_numbers: [
          { id: '', phone_number: '111-111-1111', phone_number_type: 'cell' },
          { id: '', phone_number: '222-222-2222', phone_number_type: 'home' },
        ]
      }.with_indifferent_access
    end
    let(:created_person) do
      double(:person, as_json: person_params.merge(id: 1))
    end

    before do
      person = double(:person)
      expect(Person).to receive(:new)
        .with(person_params).and_return(person)
      expect(PersonRepository).to receive(:create)
        .with(person).and_return(created_person)
    end

    it 'renders person as json' do
      post :create, params: { person: person_params }, format: :json
      expect(JSON.parse(response.body)).to eq(created_person.as_json)
    end
  end

  describe '#edit' do
    it 'renders the show template' do
      process :show, method: :get, params: { id: 1 }
      expect(response).to render_template('show')
    end
  end

  describe '#show' do
    let(:person) { double(:person, as_json: { 'id' => 1 }) }
    before do
      allow(PersonRepository).to receive(:find).with('1').and_return(person)
    end

    it 'renders the show template' do
      process :show, method: :get, params: { id: 1 }
      expect(response).to render_template('show')
    end

    it 'renders person as json' do
      process :show, method: :get, params: { id: 1 }, format: :json
      expect(JSON.parse(response.body)).to eq(person.as_json)
    end
  end

  describe '#update' do
    let(:person_params) do
      {
        id: '1',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          id: '1',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        },
        phone_numbers: [{
          id: '2',
          phone_number: '333-333-3333',
          phone_number_type: 'home',
          created_at: '2016-08-11T18:24:22.157Z',
          updated_at: '2016-08-11T18:24:22.157Z'
        }]
      }.with_indifferent_access
    end
    let(:updated_person) { double(:person, as_json: { 'id' => 'updated_person' }) }

    before do
      person = double(:person)
      expect(Person).to receive(:new).with(person_params).and_return(person)
      expect(PersonRepository).to receive(:update).with(person)
        .and_return(updated_person)
    end

    it 'updates person and renders person as json' do
      process :update,
        method: :put,
        params: { id: person_params[:id], person: person_params },
        format: :json
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_person.as_json)
    end
  end

  describe '#search' do
    it 'searches for people and renders a json with person attributes' do
      people = [
        Person.new(first_name: 'Bart', last_name: 'Simpson'),
        Person.new(first_name: 'John', last_name: 'Smith')
      ]
      allow(PeopleRepo).to receive(:search)
        .with('foobarbaz')
        .and_return(people)

      process :search, method: :get, params: { query: 'foobarbaz' }

      body = JSON.parse(response.body)
      expect(body.first['first_name']).to eq('Bart')
      expect(body.first['last_name']).to eq('Simpson')
      expect(body.last['first_name']).to eq('John')
      expect(body.last['last_name']).to eq('Smith')
    end
  end
end
