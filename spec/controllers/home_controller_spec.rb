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
end
