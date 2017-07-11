# frozen_string_literal: true

require 'rails_helper'

describe Participant do
  describe 'as_json' do
    let(:legacy_descriptor) { FactoryGirl.create(:legacy_descriptor).as_json }

    it 'returns the attributes of a participant as a hash' do
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
            id: '5',
            street_address: '2nd street',
            city: 'Bangalore',
            state: 'CA',
            zip: '51500',
            type: 'Placement'
          }
        ],
        phone_numbers: [
          {
            id: '6',
            number: '330-789-4567',
            type: 'Home'
          }
        ],
        languages: %w[English Farsi],
        legacy_descriptor: legacy_descriptor,
        races: %w[White Asian],
        legacy_id: '1',
        legacy_source_table: 'CLIENT_T',
        screening_id: '2',
        roles: ['Victim'],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican'
        }
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json.with_indifferent_access
      ).to match(
        a_hash_including(
          id: '1',
          first_name: 'Homer',
          middle_name: 'Jay',
          last_name: 'Simpson',
          name_suffix: 'esq',
          gender: 'male',
          date_of_birth: '05/29/1990',
          ssn: '123-23-1234',
          addresses: [a_hash_including(
            id: '5',
            street_address: '2nd street',
            city: 'Bangalore',
            state: 'CA',
            zip: '51500',
            type: 'Placement'
          )],
          phone_numbers: [a_hash_including(
            id: '6',
            number: '330-789-4567',
            type: 'Home'
          )],
          languages: %w[English Farsi],
          legacy_descriptor: legacy_descriptor,
          races: %w[White Asian],
          ethnicity: a_hash_including(
            hispanic_latino_origin: 'Yes',
            ethnicity_detail: 'Mexican'
          ),
          legacy_id: '1',
          legacy_source_table: 'CLIENT_T',
          screening_id: '2',
          roles: ['Victim']
        )
      )
    end
  end
end
