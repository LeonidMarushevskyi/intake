# frozen_string_literal: true

require 'rails_helper'

describe ApplicationController do
  controller do
    before_action :authenticate_user, if: :authentication_enabled?
    def custom
      render body: nil
    end
  end

  before do
    routes.draw { get 'custom' => 'anonymous#custom' }
  end

  describe '#authenticate_user' do
    context 'for all calls' do
      it 'directs the browser not to cache content' do
        process :custom, method: :get
        expect(response.headers['Cache-Control']).to eq 'no-cache, no-store'
        expect(response.headers['Pragma']).to eq 'no-cache'
        expect(response.headers['Expires']).to eq '0'
      end

      it 'disallows inclusion in frames' do
        process :custom, method: :get
        expect(response.headers['X-Frame-Options']).to eq 'DENY'
      end

      it 'directs browser behavior for cross-site-scripting attacks' do
        process :custom, method: :get
        expect(response.headers['X-XSS-Protection']).to eq '1'
      end
    end

    context 'when authentication is enabled' do
      let(:auth_artifact) do
        { 'user' => 'user', 'roles' => %w[role1 role2], 'staffId' => 'abc' }
      end
      let(:user_info) do
        { 'first_name' => 'Joe', 'last_name' => 'Cool' }
      end
      before do
        allow(Feature).to receive(:active?)
          .with(:authentication).and_return(true)
      end

      context 'when authenticated and no new token is provided' do
        it 'does nothing' do
          process :custom, method: :get, session: { security_token: 'my_secure_token' }
          expect(response).to be_successful
          expect(session[:security_token]).to eq('my_secure_token')
        end
      end

      context 'when authenticated and a new token is provided' do
        let(:new_security_token) { 'new_token' }
        let(:new_auth_artifact) do
          { 'user' => 'user1', 'roles' => %w[role3 role4], 'staffId' => 'def' }
        end
        let(:new_user_info) do
          { 'first_name' => 'Red', 'last_name' => 'Baron' }
        end
        before do
          expect(SecurityRepository).to receive(:token_valid?)
            .with(new_security_token)
            .and_return(new_auth_artifact.to_json)
          expect(StaffRepository).to receive(:find)
            .with(new_security_token, 'def')
            .and_return(new_user_info)
        end

        it 'replaces the current token' do
          process :custom,
            method: :get,
            session: { security_token: 'my_secure_token' },
            params: { token: new_security_token }

          expect(session[:security_token]).to eq(new_security_token)
          expect(session[:user_info]).to eq(new_user_info)
        end
      end

      context 'when not authenticated without valid security token' do
        before do
          allow(SecurityRepository).to receive(:token_valid?).and_return(false)
          allow(Rails.configuration).to receive(:intake)
            .and_return(authentication_login_url: 'http://authentication_url/authn/login?callback=')
        end

        it 'redirects to authentication site' do
          process :custom, method: :get
          expect(response).to redirect_to('http://authentication_url/authn/login?callback=http://test.host/custom')
        end
      end

      context 'when not authenticated with valid security token' do
        let(:security_token) { 'my_secure_token' }
        before do
          expect(SecurityRepository).to receive(:token_valid?)
            .with(security_token)
            .and_return(auth_artifact.to_json)
          expect(StaffRepository).to receive(:find)
            .with(security_token, 'abc')
            .and_return(user_info.to_json)
        end

        it 'sets session security token' do
          process :custom, method: :get, params: { token: security_token }
          expect(session[:security_token]).to eq security_token
          expect(session[:user_info]).to eq user_info
        end
      end
    end

    context 'when authentication is disabled' do
      before do
        allow(Feature).to receive(:active?)
          .with(:authentication).and_return(false)
      end

      it 'does nothing' do
        process :custom, method: :get
        expect(response).to be_successful
      end
    end
  end
end
