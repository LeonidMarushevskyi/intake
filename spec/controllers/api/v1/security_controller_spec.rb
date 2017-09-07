# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::SecurityController do
  let(:security_token) { 'security_token' }

  describe '#check_permission' do
    context 'with no permission in session' do
      let(:session) do
        {
          security_token: security_token,
          user_details: {
          }
        }
      end

      it 'returns true' do
        process :check_permission,
          method: :get,
          params: { permission: :add_sensitive_people },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('false')
      end
    end

    context 'with permission to add_sensitive_people' do
      let(:session) do
        {
          security_token: security_token,
          user_details: {
            'privileges' => ['Sensitive Persons']
          }
        }
      end

      it 'returns true' do
        process :check_permission,
          method: :get,
          params: { permission: :add_sensitive_people },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('true')
      end
    end

    context 'without permission to add_sensitive_people' do
      let(:session) do
        {
          security_token: security_token,
          user_details: {
            'privileges' => []
          }
        }
      end

      it 'returns false' do
        process :check_permission,
          method: :get,
          params: { permission: :add_sensitive_people },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('false')
      end
    end
  end
end
