# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ScreeningsController do
  describe '#create' do
    let(:created_screening) { double(:screening, id: '1') }
    before do
      allow(LUID).to receive(:generate).and_return(['123ABC'])
      screening = double(:screening)
      expect(Screening).to receive(:new)
        .with(reference: '123ABC').and_return(screening)
      expect(ScreeningRepository).to receive(:create).with(screening)
        .and_return(created_screening)
    end

    it 'creates and renders screening as json' do
      process :create, method: :post, format: :json
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(created_screening.as_json)
    end
  end

  describe '#show' do
    let(:screening) { double(:screening) }

    before do
      expect(ScreeningRepository).to receive(:find).with('1').and_return(screening)
    end

    it 'renders screening as json' do
      process :show, method: :get, params: { id: '1' }, format: :json
      expect(JSON.parse(response.body)).to eq(screening.as_json)
    end
  end

  describe '#update' do
    let(:screening_params) do
      {
        id: '1',
        assignee: 'Robert Smith',
        incident_county: 'sacramento',
        name: '123 Report',
        response_time: 'immediate',
        screening_decision: 'evaluate_out',
        address: {
          id: '2',
          city: 'LA',
          state: 'CA',
          street_address: '123 Fake St',
          zip: '11222'
        }
      }.with_indifferent_access
    end
    let(:updated_screening) { double(:screening, as_json: { 'id' => 'updated_screening' }) }

    before do
      screening = double(:screening)
      expect(Screening).to receive(:new).with(screening_params).and_return(screening)
      expect(ScreeningRepository).to receive(:update).with(screening).and_return(updated_screening)
    end

    it 'updates and renders screening as json' do
      process :update,
        method: :put,
        params: { id: screening_params[:id], screening: screening_params },
        format: :json
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_screening.as_json)
    end
  end

  describe '#index' do
    context 'without response_times or screening_decisions' do
      let(:screenings) { double(:screenings, as_json: [{ id: '1' }]) }
      before do
        allow(ScreeningRepository).to receive(:search)
          .and_return(screenings)
      end

      it 'renders screenings as json' do
        process :index, method: :get, format: :json
        expect(JSON.parse(response.body)).to eq([{ 'id' => '1' }])
      end
    end

    context 'with response_times and screening_decisions' do
      let(:screenings) { double(:screenings, as_json: []) }
      let(:params) do
        { response_times: %w(immediate within_twenty_four_hours) }
      end

      before do
        expect(ScreeningRepository).to receive(:search)
          .with('response_times' => %w(immediate within_twenty_four_hours))
          .and_return(screenings)
      end

      it 'renders screenings returned from screening repository' do
        process :index, method: :get, format: :json, params: params
        expect(JSON.parse(response.body)).to eq([])
      end
    end
  end
end
