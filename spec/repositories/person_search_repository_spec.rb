# frozen_string_literal: true
require 'rails_helper'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }
    let(:search_term) { 'Robert Barathian' }

    before do
      expect(API).to receive(:make_api_call)
        .with(security_token, "/api/v1/people_search?search_term=#{CGI.escape(search_term)}", :get)
        .and_return(response)
    end

    it 'returns the people results' do
      person_results = described_class.search(security_token, search_term)
      expect(person_results.first.id).to eq('1')
      expect(person_results.last.id).to eq('2')
    end
  end
end
