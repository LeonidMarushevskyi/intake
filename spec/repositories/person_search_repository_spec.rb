# frozen_string_literal: true
require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }
    let(:search_term) { 'Robert Barathian' }

    it 'returns the people results using intake API' do
      Feature.run_with_deactivated(:people_search_tpt) do
        expect(API).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v1/people_search?search_term=#{CGI.escape(search_term)}",
            :get
          )
          .and_return(response)
        person_results = PersonSearchRepository.search(security_token, search_term)
        expect(person_results.first.id).to eq('1')
        expect(person_results.last.id).to eq('2')
      end
    end

    it 'returns the people results using TPT API' do
      Feature.run_with_activated(:people_search_tpt) do
        expect(API).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v2/people_search?search_term=#{CGI.escape(search_term)}",
            :get
          )
          .and_return(response)
        person_results = PersonSearchRepository.search(security_token, search_term)
        expect(person_results.first.id).to eq('1')
        expect(person_results.last.id).to eq('2')
      end
    end
  end
end
