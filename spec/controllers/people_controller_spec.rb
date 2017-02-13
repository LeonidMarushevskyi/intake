# frozen_string_literal: true
require 'rails_helper'

describe PeopleController do
  describe '#new' do
    it 'renders the show template' do
      process :new, method: :get
      expect(response).to render_template('show')
    end
  end

  describe '#edit' do
    it 'renders the show template' do
      process :show, method: :get, params: { id: '1' }
      expect(response).to render_template('show')
    end
  end

  describe '#show' do
    let(:person) { double(:person, as_json: { 'id' => '1' }) }
    before do
      allow(PersonRepository).to receive(:find).with('1').and_return(person)
    end

    it 'renders the show template' do
      process :show, method: :get, params: { id: '1' }
      expect(response).to render_template('show')
    end
  end
end
