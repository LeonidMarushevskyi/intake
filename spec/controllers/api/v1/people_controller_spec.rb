# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#search' do
    it 'searches for people and renders a json with person attributes' do
      people = double(:people_results, as_json: 'people results')
      allow(PersonSearchRepository).to receive(:search)
        .with(security_token, 'foobarbaz')
        .and_return(people)

      process :search, method: :get, params: { search_term: 'foobarbaz' }, session: session

      expect(response).to be_successful
      expect(response.body).to eq('"people results"')
    end
  end
end
