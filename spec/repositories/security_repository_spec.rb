# frozen_string_literal: true

require 'rails_helper'

describe SecurityRepository do
  describe '.login_url' do
    before do
      allow(Rails.configuration).to receive(:intake)
        .and_return(authentication_login_url: 'http://www.example.com?callback=')
    end

    it 'returns the security login url' do
      expect(described_class.login_url('my_callback')).to eq(
        'http://www.example.com?callback=my_callback'
      )
    end
  end

  describe '.token_validation_url' do
    before do
      allow(Rails.configuration).to receive(:intake)
        .and_return(authentication_base_url: 'http://www.example.com')
    end

    it 'returns the security token validation url' do
      expect(described_class.token_validation_url('123')).to eq(
        'http://www.example.com/authn/validate?token=123'
      )
    end
  end

  describe '.auth_artifact_for_token' do
    let(:token) { '123' }
    before do
      allow(Rails.configuration).to receive(:intake)
        .and_return(authentication_base_url: 'http://www.example.com')
    end

    context 'when provided with a valid security token' do
      let(:auth_artifact) do
        {
          auth_info: 'auth stuff'
        }
      end

      before do
        stub_request(:get, 'http://www.example.com/authn/validate?token=123')
          .and_return(json_body(auth_artifact.to_json, status: 200))
      end

      it 'returns an authorization artifact' do
        expect(described_class.auth_artifact_for_token(token)).to eq auth_artifact.to_json
      end
    end

    context 'when provided with an invalid security token' do
      before do
        stub_request(:get, 'http://www.example.com/authn/validate?token=123')
          .and_return(status: 401)
      end

      it 'returns nil if status is not 200' do
        expect(described_class.auth_artifact_for_token(token)).to be nil
      end
    end
  end
end
