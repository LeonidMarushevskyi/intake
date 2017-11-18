# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ErrorsController, type: :controller do
  describe 'GET #forbidden' do
    it 'returns http 403' do
      get :forbidden
      expect(response).to have_http_status(403)
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
