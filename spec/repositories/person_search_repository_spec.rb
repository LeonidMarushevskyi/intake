# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:results) do
      {
        'hits' =>  {
          'hits' =>  [
            { '_source' => { 'id' => '1' } },
            { '_source' => { 'id' => '2' } }
          ]
        }
      }
    end

    let(:response) { double(:response, body: results, status: 200) }
    let(:search_term) { 'Robert Barathian' }
    let(:post) do
      {
        query: {
          bool: {
            must: [{
              multi_match: {
                query: 'robert barathian',
                type: 'cross_fields',
                operator: 'and',
                fields: %w[searchable_name searchable_date_of_birth ssn]
              }
            }]
          }
        },
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
        highlight:
        {
          order: 'score',
          number_of_fragments: 3,
          require_field_match: false,
          fields: {
            :* => {}
          }
        }
      }
    end

    it 'returns the people results using Intake API' do
      expect(DoraAPI).to receive(:make_api_call)
        .with(
          security_token,
          '/dora/people/person/_search',
          :post,
          post
        ).and_return(response)
      person_results = PersonSearchRepository.search(security_token, search_term)
      expect(person_results.first.id).to eq('1')
      expect(person_results.last.id).to eq('2')
    end
  end
end
