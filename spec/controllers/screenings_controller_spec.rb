# frozen_string_literal: true

require 'rails_helper'

describe ScreeningsController do
  describe '#create' do
    let(:created_screening) { double(:screening, id: 1) }
    before do
      allow(LUID).to receive(:generate).and_return(['123ABC'])
      screening = double(:screening)
      expect(Screening).to receive(:new)
        .with(reference: '123ABC').and_return(screening)
      expect(ScreeningRepository).to receive(:create).with(screening)
        .and_return(created_screening)
    end

    it 'assigns screening' do
      process :create, method: :post
      expect(assigns(:screening)).to eq(created_screening)
    end

    it 'redirects to edit' do
      process :create, method: :post
      expect(response).to redirect_to(edit_screening_path(created_screening))
    end
  end

  describe '#edit' do
    let(:screening) { double(:screening) }
    let(:participants) { [double(:participant1), double(:participant2)] }

    before do
      expect(ScreeningRepository).to receive(:find).with('1').and_return(screening)
      expect(screening).to receive(:participants).and_return(participants)
    end

    it 'assigns screening' do
      process :edit, method: :get, params: { id: 1 }
      expect(assigns(:screening)).to eq(screening)
    end

    it 'assigns participants' do
      process :edit, method: :get, params: { id: 1 }
      expect(assigns(:participants)).to eq(participants)
    end

    it 'renders the edit template' do
      process :edit, method: :get, params: { id: 1 }
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
      process :show, method: :get, params: { id: 1 }
      expect(assigns(:screening)).to eq(screening)
    end

    it 'assigns participants' do
      process :show, method: :get, params: { id: 1 }
      expect(assigns(:participants)).to eq(participants)
    end

    it 'renders the show template' do
      process :show, method: :get, params: { id: 1 }
      expect(response).to render_template('show')
    end
  end

  describe '#update' do
    let(:screening) { double(:screening) }
    let(:screening_attributes) do
      {
        name: '123 Report',
        incident_county: 'sacramento',
        response_time: 'immediate',
        screening_decision: 'evaluate_out',
        address: {
          city: 'LA',
          state: 'CA',
          street_address: '123 Fake St',
          zip: '11222'
        }
      }.with_indifferent_access
    end
    before do
      allow(Screening).to receive(:save_existing).with(
        '1',
        screening_attributes
      ).and_return(screening)
    end

    it 'assigns screening' do
      process :update, method: :put, params: { id: 1, screening: screening_attributes }
      expect(assigns(:screening)).to eq(screening)
    end

    it 'redirects to show' do
      process :update, method: :put, params: { id: 1, screening: screening_attributes }
      expect(response).to redirect_to(screening_path(assigns(:screening)))
    end
  end

  describe '#index' do
    context 'without query params' do
      let(:screenings) { double(:screenings, as_json: [{ id: 1 }]) }
      let(:search) { double(:search, results: screenings) }
      before do
        allow(ScreeningsRepo).to receive(:search)
          .with(query: { filtered: { filter: { bool: { must: [] } } } })
          .and_return(search)
      end

      it 'renders screenings as json' do
        process :index, method: :get, format: :json
        expect(JSON.parse(response.body)).to eq([{ 'id' => 1 }])
      end

      it 'renders the index template' do
        process :index, method: :get
        expect(response).to render_template('index')
      end
    end

    context 'with query params' do
      let(:query) do
        {
          filtered: {
            filter: {
              bool: {
                must: [{
                  terms: { response_time: %w(immediate within_twenty_four_hours) }
                }]
              }
            }
          }
        }
      end
      let(:screenings) { double(:screenings, as_json: []) }
      let(:search) { double(:search, results: screenings) }
      let(:params) do
        { response_times: %w(immediate within_twenty_four_hours) }
      end

      before do
        expect(ScreeningsRepo).to receive(:search)
          .with(query: query)
          .and_return(search)
      end

      it 'renders screenings returned from filtered query' do
        process :index, method: :get, format: :json, params: params
        expect(JSON.parse(response.body)).to eq([])
      end
    end
  end
end
