# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:search_term) { 'Robert Barathian' }
    let(:query) do
      {
        size: 25,
        track_scores: true,
        sort: [{ _score: 'desc', _uid: 'desc' }],
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

    context 'when response from DORA is successful' do
      let(:results) do
        {
          'hits' =>  {
            'total' => 456,
            'hits' =>  [
              { '_source' => { 'id' => '1' } },
              { '_source' => { 'id' => '2' } }
            ]
          }
        }
      end
      let(:response) { double(:response, body: results, status: 200) }
      it 'returns the people search results' do
        expect(DoraAPI).to receive(:make_api_call)
          .with(security_token, '/dora/people-summary/person-summary/_search', :post, query)
          .and_return(response)
        expect(
          described_class.search(security_token, search_term)
        ).to match a_hash_including(
          'hits' => a_hash_including(
            'total' => 456,
            'hits' => array_including(
              a_hash_including(
                'id' => '1',
                'sensitive' => false,
                'sealed' => false,
                'highlight' => {},
                'legacy_id' => '1'
              ),
              a_hash_including(
                'id' => '2',
                'sensitive' => false,
                'sealed' => false,
                'highlight' => {},
                'legacy_id' => '2'
              )
            )
          )
        )
      end
    end

    context 'when response from DORA is successful' do
      let(:response) { double(:response, body: 'Some error payload', status: 401) }
      before do
        allow(DoraAPI).to receive(:make_api_call)
          .with(security_token, '/dora/people-summary/person-summary/_search', :post, query)
          .and_return(response)
      end
      it 'raises an error' do
        expect do
          described_class.search(security_token, search_term)
        end.to raise_error('Some error payload')
      end
    end
  end
end
