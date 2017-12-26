# frozen_string_literal: true

require 'rails_helper'

describe PersonSearchQueryBuilder do
  let(:search_term) { '' }
  let(:source) do
    [
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
    ]
  end

  let(:highlight) do
    {
      order: 'score',
      number_of_fragments: 3,
      require_field_match: false,
      fields: { '*': {} }
    }
  end
  describe '.build' do
    it 'builds a person search query' do
      search_term = 'this is my search term'
      expect(described_class.new(search_term).build).to eq(
        _source: source,
        highlight: highlight,
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
    it 'build new person with ssn search query' do
      search_term = 'search query with dashes 1-1'
      expect(described_class.new(search_term).build).to eq(
        _source: source,
        highlight: highlight,
        query: {
          bool: {
            must: [{
              multi_match: {
                query: 'search query with dashes 11',
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
