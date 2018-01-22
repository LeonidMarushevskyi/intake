# frozen_string_literal: true

require 'rails_helper'
require 'controllers/shared_examples_for_authenticated_controllers'

describe HomeController do
  describe '#index' do
    it_behaves_like 'an authenticated controller action' do
      subject { process :index, method: :get }
    end

    it 'responds with success' do
      process :index, method: :get
      assert_response :success
      expect(response).to render_template('index')
    end
  end

  describe '#logout' do
    before do
      allow(SecurityRepository).to receive(:logout_url).and_return('http://www.logouturl.com')
      @request.session[:security_token] = 'my_secure_token'
      @request.session[:user_details] = { first_name: 'Bob' }
    end

    it 'clears the session for a user and redirects to the logout URL' do
      process :logout, method: :get
      expect(session[:security_token]).to be_nil
      expect(session[:user_details]).to be_nil
      expect(response).to redirect_to('http://www.logouturl.com')
    end
  end
end
