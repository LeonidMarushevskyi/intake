# frozen_string_literal: true

require 'rails_helper'

describe PersonSearch do
  describe 'as_json' do
    let(:legacy_descriptor) do
      FactoryGirl.create(
        :legacy_descriptor,
        legacy_id: '123',
        legacy_last_updated: '456',
        legacy_table_description: 'Definitely on purpose!',
        legacy_table_name: 'CLIENT_T',
        legacy_ui_id: 'CLIENT'
      )
    end

    it 'returns the attributes of a person as a hash' do
      attributes = {
        id: '1',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [
          {
            id: '2',
            street_address: '123 fake st',
            city: 'Springfield',
            state: 'NY',
            zip: '12345',
            type: 'Work'
          },
          {
            id: '3',
            street_address: '711 capital mall',
            city: 'Sacramento',
            state: 'CA',
            zip: '95822',
            type: 'Home'
          }
        ],
        phone_numbers: [
          { id: '1', number: '111-111-1111', type: 'Cell' },
          { id: '2', number: '222-222-2222', type: 'Home' }
        ],
        languages: %w[English Farsi],
        races: %w[White Asian],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: ['Mexican']
        },
        highlight: {
          first_name: '<em>Hom</em>er'
        },
        sealed: false,
        sensitive: true,
        legacy_source_table: 'test source table',
        legacy_descriptor: legacy_descriptor.as_json
      }
      expect(described_class.new(attributes).as_json).to eq(
        'id' => '1',
        'first_name' => 'Homer',
        'middle_name' => 'Jay',
        'last_name' => 'Simpson',
        'name_suffix' => 'esq',
        'gender' => 'male',
        'date_of_birth' => '05/29/1990',
        'ssn' => '123-23-1234',
        'addresses' => [{
          'id' => '2',
          'street_address' => '123 fake st',
          'city' => 'Springfield',
          'state' => 'NY',
          'zip' => '12345',
          'type' => 'Work',
          'legacy_id' => nil,
          'legacy_source_table' => nil
        }, {
          'id' => '3',
          'street_address' => '711 capital mall',
          'city' => 'Sacramento',
          'state' => 'CA',
          'zip' => '95822',
          'type' => 'Home',
          'legacy_id' => nil,
          'legacy_source_table' => nil
        }],
        'phone_numbers' => [{
          'id' => '1',
          'number' => '111-111-1111',
          'type' => 'Cell'
        }, {
          'id' => '2',
          'number' => '222-222-2222',
          'type' => 'Home'
        }],
        'languages' => %w[English Farsi],
        'races' => %w[White Asian],
        'ethnicity' => {
          'hispanic_latino_origin' => 'Yes',
          'ethnicity_detail' => ['Mexican']
        },
        'highlight' => {
          'first_name' => '<em>Hom</em>er'
        },
        'sealed' => false,
        'sensitive' => true,
        'legacy_source_table' => 'test source table',
        'legacy_descriptor' => {
          'id' => legacy_descriptor.id,
          'legacy_id' => '123',
          'legacy_last_updated' => '456',
          'legacy_table_description' => 'Definitely on purpose!',
          'legacy_table_name' => 'CLIENT_T',
          'legacy_ui_id' => 'CLIENT'
        }
      )
    end
  end
end
