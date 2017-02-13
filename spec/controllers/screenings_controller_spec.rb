# frozen_string_literal: true

require 'rails_helper'

describe ScreeningsController do
  describe '#edit' do
    let(:screening) { double(:screening) }
    let(:participants) { [double(:participant1), double(:participant2)] }

    before do
      expect(ScreeningRepository).to receive(:find).with('1').and_return(screening)
      expect(screening).to receive(:participants).and_return(participants)
    end

    it 'assigns screening' do
      process :edit, method: :get, params: { id: '1' }
      expect(assigns(:screening)).to eq(screening)
    end

    it 'assigns participants' do
      process :edit, method: :get, params: { id: '1' }
      expect(assigns(:participants)).to eq(participants)
    end

    it 'renders the edit template' do
      process :edit, method: :get, params: { id: '1' }
      expect(response).to render_template('edit')
    end
  end

  describe '#show' do
    let(:screening) { double(:screening) }
    let(:participants) { [double(:participant1), double(:participant2)] }

    before do
      expect(ScreeningRepository).to receive(:find).with('1').and_return(screening)
      expect(screening).to receive(:participants).and_return(participants)
    end

    it 'assigns screening' do
      process :show, method: :get, params: { id: '1' }
      expect(assigns(:screening)).to eq(screening)
    end

    it 'assigns participants' do
      process :show, method: :get, params: { id: '1' }
      expect(assigns(:participants)).to eq(participants)
    end

    it 'renders the show template' do
      process :show, method: :get, params: { id: '1' }
      expect(response).to render_template('show')
    end
  end

  describe '#index' do
    context 'without response_times or screening_decisions' do
      let(:screenings) { double(:screenings, as_json: [{ id: '1' }]) }
      before do
        allow(ScreeningRepository).to receive(:search)
          .and_return(screenings)
      end

      it 'renders the index template' do
        process :index, method: :get
        expect(response).to render_template('index')
      end
    end
  end
end
