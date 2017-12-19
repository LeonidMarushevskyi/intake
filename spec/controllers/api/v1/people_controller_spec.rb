# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#search' do
    it 'searches for people and renders a json with person attributes' do
      people = double(:search_response, as_json: 'search response')
      allow(PersonSearchRepository).to receive(:search)
        .with(security_token: security_token, search_term: 'foobarbaz')
        .and_return(people)

      process :search, method: :get, params: { search_term: 'foobarbaz' }, session: session

      expect(response).to be_successful
      expect(response.body).to eq('"search response"')
    end
  end
end
