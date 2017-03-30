# frozen_string_literal: true
require 'rails_helper'

describe PersonSearchRepository do
  describe '.search' do
    it 'raise an error if the response code is not 200' do
      stub_request(:get, %r{/api/v1/people_search\?search_term=})
        .and_return(status: 500, headers: { 'Content-Type': 'application/json' })

      expect do
        described_class.search('')
      end.to raise_error(ApiError)
    end

    it 'returns the people search results when people search is successful' do
      results = [{ id: '1', highlight: { first_name: 'Robert' } }, { id: '2' }].to_json
      stub_request(:get, %r{/api/v1/people_search\?search_term=FirstName})
        .and_return(body: results, status: 200, headers: { 'Content-Type': 'application/json' })

      expect(described_class.search('FirstName').length).to eq(2)
      expect(described_class.search('FirstName')[0].id).to eq('1')
      expect(described_class.search('FirstName')[0].highlight['first_name']).to eq('Robert')
      expect(described_class.search('FirstName')[1].id).to eq('2')
    end

    it 'sends a GET request to api people search' do
      stub_request(:get, %r{/api/v1/people_search\?search_term=Nothing})
        .and_return(body: [].to_json, status: 200, headers: { 'Content-Type': 'application/json' })

      described_class.search('Nothing')
      expect(a_request(:get, %r{/api/v1/people_search\?search_term=Nothing})).to have_been_made
    end
  end
end
