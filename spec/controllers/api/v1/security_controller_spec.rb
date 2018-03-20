# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::SecurityController do
  let(:security_token) { 'security_token' }

  describe '#check_permissions' do
    context 'with no permissions in session' do
      let(:session) do
        {
          security_token: security_token,
          user_details: {}
        }
      end

      it 'returns false for invalid privileges' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":false}')
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

      it 'returns a hash with the permission set to true' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":true}')
      end
    end

    context 'with multiple permissions' do
      let(:session) do
        {
          security_token: security_token,
          user_details: {
            'privileges' => ['Sensitive Persons', 'CARES Hotline']
          }
        }
      end

      it 'returns a hash with multiple values true' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people,can_see_hotline' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":true,"can_see_hotline":true}')
      end

      it 'returns a hash with true/false' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people,can_see_snapshot' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":true,"can_see_snapshot":false}')
      end

      it 'returns a hash only with valid existent permissions' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people,can_see_snapshot,not_a_valid_permission' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":true,"can_see_snapshot":false}')
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

      it 'returns hash with the permission set to false' do
        process :check_permissions,
          method: :get,
          params: { permissions: 'add_sensitive_people' },
          session: session
        expect(response.status).to eq(200)
        expect(response.body).to eq('{"add_sensitive_people":false}')
      end
    end
  end
end
