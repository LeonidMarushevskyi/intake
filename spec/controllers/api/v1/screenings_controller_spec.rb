# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ScreeningsController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#create' do
    let(:created_screening) { double(:screening, id: '1') }
    before do
      allow(LUID).to receive(:generate).and_return(['123ABC'])
      screening = double(:screening)
      expect(Screening).to receive(:new)
        .with(reference: '123ABC').and_return(screening)
      expect(ScreeningRepository).to receive(:create)
        .with(security_token, screening)
        .and_return(created_screening)
    end

    it 'creates and renders screening as json' do
      process :create, method: :post, session: session
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(created_screening.as_json)
    end
  end

  describe '#show' do
    let(:screening) { double(:screening) }

    before do
      expect(ScreeningRepository).to receive(:find)
        .with(security_token, '1')
        .and_return(screening)
    end

    it 'renders screening as json' do
      process :show, method: :get, params: { id: '1' }, session: session
      expect(JSON.parse(response.body)).to eq(screening.as_json)
    end
  end

  describe '#update' do
    let(:screening_params) do
      {
        id: '1',
        assignee: 'Robert Smith',
        additional_information: 'the new decision is updated',
        incident_county: 'sacramento',
        name: '123 Report',
        screening_decision: 'evaluate_out',
        cross_reports: [
          {
            agency_type: 'Department of justice',
            agency_name: 'SCD office'
          },
          {
            agency_type: 'Licensing',
            agency_name: 'SCD office'
          }
        ],
        address: {
          id: '2',
          city: 'LA',
          state: 'CA',
          street_address: '123 Fake St',
          zip: '11222'
        },
        allegations: [{
          id: '2',
          screening_id: '3',
          perpetrator_id: '4',
          perpetrator: { first_name: 'name' },
          victim_id: '5',
          victim: { first_name: 'name' },
          allegation_types: ['General neglect']
        }]
      }.with_indifferent_access
    end
    let(:unallowed_params) { %i[perpetrator victim] }
    let(:updated_screening) { double(:screening, as_json: { 'id' => 'updated_screening' }) }

    before do
      screening = double(:screening)
      screening_attributes = screening_params.as_json(except: unallowed_params)
      expect(Screening).to receive(:new).with(screening_attributes).and_return(screening)
      expect(ScreeningRepository).to receive(:update)
        .with(security_token, screening)
        .and_return(updated_screening)
    end

    it 'updates and renders screening as json' do
      process :update,
        method: :put,
        params: { id: screening_params[:id], screening: screening_params },
        format: :json,
        session: session
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_screening.as_json)
    end
  end

  describe '#index' do
    context 'without screening_decisions' do
      let(:screenings) { double(:screenings, as_json: [{ id: '1' }]) }
      before do
        allow(ScreeningRepository).to receive(:search)
          .with(security_token, {})
          .and_return(screenings)
      end

      it 'renders screenings as json' do
        process :index, method: :get, session: session
        expect(JSON.parse(response.body)).to eq([{ 'id' => '1' }])
      end
    end

    context 'with screening_decisions' do
      let(:screenings) { double(:screenings, as_json: []) }
      let(:params) do
        { screening_decisions: %w[screen_out promote_to_referral] }
      end

      before do
        expect(ScreeningRepository).to receive(:search)
          .with(security_token, 'screening_decisions' => %w[screen_out promote_to_referral])
          .and_return(screenings)
      end

      it 'renders screenings returned from screening repository' do
        process :index, method: :get, params: params, session: session
        expect(JSON.parse(response.body)).to eq([])
      end
    end
  end

  describe '#history_of_involvements' do
    let(:involvements) { [{ 'id' => 1 }, { 'id' => 2 }] }
    let(:screening_id) { '99' }

    before do
      expect(ScreeningRepository).to receive(:history_of_involvements)
        .with(security_token, screening_id)
        .and_return(involvements)
    end

    it 'returns history of involvements' do
      get :history_of_involvements, params: { id: screening_id }, session: session
      expect(response).to be_successful
      expect(response.body).to eq involvements.to_json
    end
  end

  describe '#submit' do
    let(:screening_id) { '99' }

    before do
      expect(ScreeningRepository).to receive(:submit)
        .with(security_token, screening_id)
        .and_return(nil)
    end

    it 'submits screening' do
      post :submit, params: { id: screening_id }, session: session
      expect(response).to be_successful
      expect(response.body).to eq ''
    end
  end
end
