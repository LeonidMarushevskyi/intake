# frozen_string_literal: true

require 'rails_helper'
require 'controllers/shared_examples_for_authenticated_controllers'

describe PagesController, '#show' do
  %w[privacy conditions_of_use].each do |page|
    context "on GET to /pages/#{page}" do
      before do
        process :show, method: :get, params: { id: page }
      end

      it 'responds with success' do
        expect(response).to be_successful
      end
      it 'renders the template on views/pages' do
        should render_template(page)
      end
    end

    context 'endpoints should work with authentication' do
      it_behaves_like 'an authenticated controller action' do
        subject { process :show, method: :get, params: { id: page } }
      end
    end
  end
end
