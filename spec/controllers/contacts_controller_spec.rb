# frozen_string_literal: true

require 'rails_helper'
require 'controllers/shared_examples_for_authenticated_controllers'

describe ContactsController do
  describe '#new' do
    let(:params) do
      { investigation_id: 'ABC123' }
    end

    it_behaves_like 'an authenticated controller action' do
      subject { process :new, method: :get, params: params }
    end

    it 'responds with success' do
      process :new, method: :get, params: params
      assert_response :success
      expect(response).to render_template('show')
    end
  end

  describe '#show' do
    let(:params) do
      { investigation_id: 'ABC123', id: '123' }
    end

    it_behaves_like 'an authenticated controller action' do
      subject { process :show, method: :get, params: params }
    end

    it 'responds with success' do
      process :show, method: :get, params: params
      assert_response :success
      expect(response).to render_template('show')
    end
  end
end
