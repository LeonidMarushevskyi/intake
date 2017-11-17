# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ErrorsController, type: :controller do
  describe 'GET #unauthorized' do
    it 'returns http 401' do
      get :unauthorized
      expect(response).to have_http_status(401)
    end
  end

  describe 'GET #not_found' do
    it 'returns http 404' do
      get :not_found
      expect(response).to have_http_status(404)
    end
  end

  describe 'GET #server_error' do
    it 'returns http 500' do
      get :server_error
      expect(response).to have_http_status(500)
    end
  end
end
