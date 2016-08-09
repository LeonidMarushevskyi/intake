# frozen_string_literal: true
require 'rails_helper'

describe StyleGuideController do
  describe '#index' do
    it 'responds with success' do
      get :index
      assert_response :success
      expect(response).to render_template('index')
    end
  end

  describe '#show' do
    it 'when id is forms it renders forms' do
      get :show, params: { id: :forms }
      assert_response :success
      expect(response).to render_template('style_guide/show/forms')
    end

    it 'when id is lists it renders lists' do
      get :show, params: { id: :lists }
      assert_response :success
      expect(response).to render_template('style_guide/show/lists')
    end
  end
end
