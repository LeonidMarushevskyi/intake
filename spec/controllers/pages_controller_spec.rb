require 'rails_helper'

describe PagesController, '#show' do
  %w(privacy conditions_of_use).each do |page|
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
  end
end
