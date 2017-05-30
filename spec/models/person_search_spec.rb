# frozen_string_literal: true

require 'rails_helper'

describe PersonSearch do
  describe 'as_json' do
    it 'returns the attributes of a person as a hash' do
      attributes = {
        id: '1',
        legacy_source_table: 'CLIENT_T',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [],
        phone_numbers: [],
        languages: [],
        races: [],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican'
        },
        highlight: {
          first_name: '<em>Hom</em>er'
        }
      }.with_indifferent_access
      expect(described_class.new(attributes).as_json).to eq({
        id: '1',
        legacy_source_table: 'CLIENT_T',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [],
        phone_numbers: [],
        languages: [],
        races: [],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican'
        },
        highlight: {
          first_name: '<em>Hom</em>er'
        }
      }.with_indifferent_access)
    end
  end
end
