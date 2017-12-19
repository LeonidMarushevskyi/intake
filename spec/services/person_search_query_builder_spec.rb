# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchQueryBuilder do
  let(:search_term) { 'This is my search term' }
  describe '.build' do
    it 'builds a person search query' do
      expect(
        described_class.new(search_term: search_term).build
      ).to eq(
        _source: [
          'id',
          'legacy_source_table',
          'first_name',
          'middle_name',
          'last_name',
          'name_suffix',
          'gender',
          'date_of_birth',
          'ssn',
          'languages',
          'races',
          'ethnicity',
          'addresses.id',
          'addresses.street_name',
          'addresses.street_number',
          'addresses.city',
          'addresses.state_code',
          'addresses.zip',
          'addresses.type',
          'phone_numbers.id',
          'phone_numbers.number',
          'phone_numbers.type',
          'highlight',
          'legacy_descriptor',
          'sensitivity_indicator',
          'race_ethnicity'
        ],
        highlight: {
          order: 'score',
          number_of_fragments: 3,
          require_field_match: false,
          fields: { '*': {} }
        },
        size: 25,
        track_scores: true,
        sort: [{ _score: 'desc', _uid: 'desc' }],
        query: {
          bool: {
            must: [{
              multi_match: {
                query: 'this is my search term',
                type: 'cross_fields',
                operator: 'and',
                fields: %w[searchable_name searchable_date_of_birth ssn]
              }
            }]
          }
        }
      )
    end
  end
end
