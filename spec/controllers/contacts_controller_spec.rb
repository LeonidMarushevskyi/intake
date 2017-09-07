# frozen_string_literal: true

require 'rails_helper'
require 'controllers/shared_examples_for_authenticated_controllers'

describe ContactsController do
  describe '#new' do
    it_behaves_like 'an authenticated controller action' do
      subject { process :new, method: :get, params: { investigation_id: 'ABC123' } }
    end

    it 'responds with success' do
      process :new, method: :get, params: { investigation_id: 'ABC123' }
      assert_response :success
      expect(response).to render_template('new')
    end
  end
end
