# frozen_string_literal: true

require 'rails_helper'

describe RelationshipsRepository do
  let(:security_token) { 'my_security_token' }

  describe '.find_by_screening_id' do
    let(:screening_id) { '12' }

    it 'returns the relationships for all participants' do
      stub_request(:get, "http://api:3000/api/v1/screenings/#{screening_id}/relationships")
        .with(headers: { 'Authorization' => 'my_security_token' })
        .to_return(status: 200, body: [], headers: {})

      relationships = described_class.find_by_screening_id(security_token, screening_id)

      expect(relationships).to eq([])
    end
  end
end
