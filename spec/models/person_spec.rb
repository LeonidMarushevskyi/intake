# frozen_string_literal: true
require 'rails_helper'

describe Person do
  describe 'as_json' do
    it 'returns the attributes of a person as a hash' do
      attributes = {
        id: 1,
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [
          {
            id: 2,
            street_address: '123 fake st',
            city: 'Springfield',
            state: 'NY',
            zip: '12345',
            type: 'Placement'
          },
          {
            id: 3,
            street_address: '711 capital mall',
            city: 'Sacramento',
            state: 'CA',
            zip: '95822',
            type: 'Home'
          }
        ],
        phone_numbers: [
          { id: 1, number: '111-111-1111', type: 'Cell' },
          { id: 2, number: '222-222-2222', type: 'Home' }
        ],
        languages: %w(English Farsi),
        races: %w(White Asian)
      }.with_indifferent_access
      expect(described_class.new(attributes).as_json).to eq({
        id: 1,
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [{
          id: 2,
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'Placement'
        }, {
          id: 3,
          street_address: '711 capital mall',
          city: 'Sacramento',
          state: 'CA',
          zip: '95822',
          type: 'Home'
        }],
        phone_numbers: [{
          id: 1,
          number: '111-111-1111',
          type: 'Cell',
          created_at: nil,
          updated_at: nil
        }, {
          id: 2,
          number: '222-222-2222',
          type: 'Home',
          created_at: nil,
          updated_at: nil
        }],
        languages: %w(English Farsi),
        races: %w(White Asian)
      }.with_indifferent_access)
    end
  end
end
