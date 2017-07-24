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
      before do
        allow(Feature).to receive(:active?)
          .with(:authentication).and_return(true)
      end

      context 'when already authenticated' do
        context 'when no new token is provided' do
          it 'does nothing' do
            process :custom, method: :get, session: { security_token: 'my_secure_token' }
            expect(response).to be_successful
            expect(session[:security_token]).to eq('my_secure_token')
          end
        end

        context 'when a new token is provided' do
          let(:new_security_token) { 'new_token' }
          let(:new_auth_artifact) do
            { 'user' => 'user1', 'roles' => %w[role3 role4], 'staffId' => 'def' }
          end
          let(:new_user_details) do
            { 'first_name' => 'Red', 'last_name' => 'Baron' }
          end
          before do
            expect(SecurityRepository).to receive(:auth_artifact_for_token)
              .with(new_security_token)
              .and_return(new_auth_artifact.to_json)
            expect(StaffRepository).to receive(:find)
              .with(new_security_token, 'def')
              .and_return(new_user_details)
          end

          it 'replaces the current token' do
            process :custom,
              method: :get,
              session: { security_token: 'my_secure_token' },
              params: { token: new_security_token }

            expect(session[:security_token]).to eq(new_security_token)
            expect(session[:user_details]).to eq(new_user_details)
          end
        end
      end

      context 'when not authenticated' do
        context 'when not provided valid security token' do
          before do
            allow(SecurityRepository).to receive(:auth_artifact_for_token).and_return(false)
            allow(Rails.configuration).to receive(:intake)
              .and_return(
                authentication_login_url: 'http://authentication_url/authn/login?callback='
              )
          end

          it 'redirects to authentication site' do
            process :custom, method: :get
            expect(response).to redirect_to('http://authentication_url/authn/login?callback=http://test.host/custom')
          end
        end

        context 'when provided valid security token but non-json auth_artifact' do
          auth_artifact = 'guest'

          let(:security_token) { 'my_secure_token' }
          before do
            expect(SecurityRepository).to receive(:auth_artifact_for_token)
              .with(security_token)
              .and_return(auth_artifact.to_json)
          end

          it 'sets session security token without errors' do
            process :custom, method: :get, params: { token: security_token }
            expect(session[:security_token]).to eq security_token
            expect(session).not_to have_key(:user_details)
          end
        end

        context 'when provided valid security token and auth_artifact' do
          auth_artifact = { 'user' => 'user', 'roles' => %w[role1 role2], 'staffId' => 'abc' }
          user_details = { 'first_name' => 'Joe', 'last_name' => 'Cool' }

          let(:security_token) { 'my_secure_token' }
          before do
            expect(SecurityRepository).to receive(:auth_artifact_for_token)
              .with(security_token)
              .and_return(auth_artifact.to_json)
            expect(StaffRepository).to receive(:find)
              .with(security_token, 'abc')
              .and_return(user_details)
          end

          it 'sets session security token' do
            process :custom, method: :get, params: { token: security_token }
            expect(session[:security_token]).to eq security_token
            expect(session[:user_details]).to eq user_details
          end
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
