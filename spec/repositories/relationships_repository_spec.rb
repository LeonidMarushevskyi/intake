# frozen_string_literal: true

require 'rails_helper'

describe RelationshipsRepository do
  let(:security_token) { 'my_security_token' }

  describe '.find_by_screening_id' do
    let(:screening_id) { '12' }
    let(:response) do
      double(:response, body: [], status: 200, headers: {})
    end

    it 'returns the relationships for all participants' do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings/#{screening_id}/relationships", :get)
        .and_return(response)

      relationships = described_class.find_by_screening_id(security_token, screening_id)

      expect(relationships).to eq([])
    end
  end
end
