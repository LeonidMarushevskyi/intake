# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe PersonSearchRepository do
  describe '.search' do
    let(:security_token) { 'my_security_token' }
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }
    let(:search_term) { 'Robert Barathian' }

    it 'returns the people results using Intake API' do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(
          security_token,
          "/api/v2/people_search?search_term=#{CGI.escape(search_term)}",
          :get
        ).and_return(response)
      person_results = PersonSearchRepository.search(security_token, search_term)
      expect(person_results.first.id).to eq('1')
      expect(person_results.last.id).to eq('2')
    end
  end
end
