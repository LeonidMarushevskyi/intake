# frozen_string_literal: true

require 'rails_helper'
require 'controllers/shared_examples_for_authenticated_controllers'

describe InvestigationsController do
  describe '#show' do
    it_behaves_like 'an authenticated controller action' do
      subject { process :show, method: :get, params: { id: '55' } }
    end

    it 'responds with success' do
      process :show, method: :get, params: { id: '55' }
      assert_response :success
      expect(response).to render_template('show')
    end
  end
end
