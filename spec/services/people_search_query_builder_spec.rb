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

  describe '.format_search_term' do
    it 'removes special characters from ssn' do
      expect(described_class.format_search_term('123-45-6789')).to eq('123456789')
    end

    it 'removes special characters from dates' do
      expect(described_class.format_search_term('3/14/1592')).to eq('3141592')
    end

    it 'replaces special characters in words with spaces' do
      expect(described_class.format_search_term('he who shall !@# be named'))
        .to eq('he who shall   be named')
    end

    it 'returns search term in all lower case' do
      expect(described_class.format_search_term('NO SCREAMING')).to eq('no screaming')
    end

    it 'returns search term without special characters' do
      expect(described_class.format_search_term('L.V. El-Reve 26/12/2017 123-45-6789'))
        .to eq('l v  el reve 26122017 123456789')
    end
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
    it 'build new person with DOB search query' do
      search_term = 'search-query with dashes 10-12/1999'
      expect(described_class.new(search_term).build).to eq(
        _source: source,
        highlight: highlight,
        query: {
          bool: {
            must: [{
              multi_match: {
                query: 'search query with dashes 10121999',
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
