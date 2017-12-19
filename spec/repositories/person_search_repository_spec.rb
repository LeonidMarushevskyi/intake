# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:search_term) { 'Robert Barathian' }
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
        fields: { :* => {} }
      }
    end
    let(:query) do
      {
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
      }
    end
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

    context 'when response from DORA is successful' do
      let(:response) { double(:response, body: results, status: 200) }

      context 'when search_after is present' do
        let(:search_after) { %w[one two] }
        let(:request_body) do
          {
            size: 25,
            track_scores: true,
            sort: [{ _score: 'desc', _uid: 'desc' }],
            search_after: search_after,
            query: query,
            _source: source,
            highlight: highlight
          }
        end

        it 'returns the people search results' do
          expect(DoraAPI).to receive(:make_api_call)
            .with(
              security_token,
              '/dora/people-summary/person-summary/_search',
              :post,
              request_body
            ).and_return(response)
          expect(
            described_class.search(
              security_token: security_token,
              search_term: search_term,
              search_after: search_after
            )
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

      context 'when search_after is not present' do
        let(:request_body) do
          {
            size: 25,
            track_scores: true,
            sort: [{ _score: 'desc', _uid: 'desc' }],
            query: query,
            _source: source,
            highlight: highlight
          }
        end

        it 'returns the people search results' do
          expect(DoraAPI).to receive(:make_api_call)
            .with(
              security_token,
              '/dora/people-summary/person-summary/_search',
              :post,
              request_body
            ).and_return(response)
          expect(
            described_class.search(
              security_token: security_token,
              search_term: search_term,
              search_after: nil
            )
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
    end

    context 'when response from DORA is successful' do
      let(:response) { double(:response, body: 'Some error payload', status: 401) }
      let(:request_body) do
        {
          size: 25,
          track_scores: true,
          sort: [{ _score: 'desc', _uid: 'desc' }],
          query: query,
          _source: source,
          highlight: highlight
        }
      end
      before do
        allow(DoraAPI).to receive(:make_api_call)
          .with(security_token, '/dora/people-summary/person-summary/_search', :post, request_body)
          .and_return(response)
      end
      it 'raises an error' do
        expect do
          described_class.search(
            security_token: security_token,
            search_term: search_term,
            search_after: nil
          )
        end.to raise_error('Some error payload')
      end
    end
  end
end
