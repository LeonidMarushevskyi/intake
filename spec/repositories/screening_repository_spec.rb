# frozen_string_literal: true

require 'rails_helper'
require 'feature/testing'

describe ScreeningRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:screening_id) { '11' }
    let(:response) { double(:response, body: { 'id' => screening_id, 'name' => 'New Screening' }) }
    let(:screening) { double(:screening, as_json: { 'id' => nil, 'name' => 'New Screening' }) }

    before do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, '/api/v1/screenings', :post, 'name' => 'New Screening')
        .and_return(response)
    end

    it 'returns the created screening' do
      created_screening = described_class.create(security_token, screening)
      expect(created_screening.id).to eq(screening_id)
      expect(created_screening.name).to eq('New Screening')
    end
  end

  describe '.find' do
    let(:screening_id) { '33' }
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Existing Screening' })
    end

    before do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings/#{screening_id}", :get)
        .and_return(response)
    end

    it 'returns the existing screening' do
      existing_screening = described_class.find(security_token, screening_id)
      expect(existing_screening.id).to eq(screening_id)
      expect(existing_screening.name).to eq('Existing Screening')
    end
  end

  describe '.update' do
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Updated Screening' })
    end
    let(:screening) do
      double(
        :screening,
        id: screening_id,
        as_json: { 'id' => screening_id, 'name' => 'Updated Screening' }
      )
    end

    context 'when screening has an id' do
      let(:screening_id) { '77' }

      before do
        expect(IntakeAPI).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v1/screenings/#{screening_id}",
            :put,
            'name' => 'Updated Screening'
          )
          .and_return(response)
      end

      it 'returns the updated screening' do
        updated_screening = described_class.update(security_token, screening)
        expect(updated_screening.id).to eq(screening_id)
        expect(updated_screening.name).to eq('Updated Screening')
      end
    end

    context 'when screening has no id' do
      let(:screening_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(security_token, screening)
        end.to raise_error('Error updating screening: id is required')
      end
    end
  end

  describe '.search' do
    let(:results) { [{ id: '1' }, { id: '2' }] }
    let(:response) { double(:response, body: results) }
    let(:search_terms) do
      { screening_decisions: %w[promote_to_referral screen_out] }
    end

    before do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings?#{search_terms.to_query}", :get)
        .and_return(response)
    end

    it 'returns the screening results' do
      screening_results = described_class.search(security_token, search_terms)
      expect(screening_results.first.id).to eq('1')
      expect(screening_results.last.id).to eq('2')
    end
  end

  describe '.history_of_involvements' do
    let(:screening_id) { '11' }

    context 'when hoi_from_intake_api is enabled' do
      let(:screening_one) { { id: '123456789' } }
      let(:screening_two) { { id: '987654321' } }
      let(:screenings) { [screening_one, screening_two] }
      let(:response) { double(:response, body: screenings.to_json) }

      around do |example|
        Feature.run_with_activated(:hoi_from_intake_api) do
          example.run
        end
      end

      it 'returns the history of involvements from intake api' do
        expect(IntakeAPI).to receive(:make_api_call)
          .with(security_token, "/api/v1/screenings/#{screening_id}/history_of_involvements", :get)
          .and_return(response)
        screenings = JSON.parse(
          described_class.history_of_involvements(security_token, screening_id)
        )
        expect(screenings[0]['id']).to eq('123456789')
        expect(screenings[1]['id']).to eq('987654321')
      end
    end

    describe 'in hotline' do
      let(:cases) { [{ legacy_descriptor: '1234' }, { legacy_descriptor: '1235' }] }
      let(:referrals) { [{ legacy_descriptor: '1236' }, { legacy_descriptor: '1237' }] }
      let(:screenings) { [{ legacy_descriptor: '1238' }, { legacy_descriptor: '1239' }] }
      let(:response) do
        double(
          :response,
          body: { screenings: screenings, cases: cases, referrals: referrals }.to_json
        )
      end

      it 'returns the history of involvements from ferb api' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(security_token, "/screenings/#{screening_id}/history_of_involvements", :get)
          .and_return(response)
        hoi = JSON.parse described_class.history_of_involvements(security_token, screening_id)
        expect(hoi['cases'].first['legacy_descriptor']).to eq('1234')
        expect(hoi['cases'].last['legacy_descriptor']).to eq('1235')
        expect(hoi['referrals'].first['legacy_descriptor']).to eq('1236')
        expect(hoi['referrals'].last['legacy_descriptor']).to eq('1237')
        expect(hoi['screenings'].first['legacy_descriptor']).to eq('1238')
        expect(hoi['screenings'].last['legacy_descriptor']).to eq('1239')
      end
    end
  end

  describe '.submit' do
    let(:screening_id) { '42' }
    let(:response) do
      double(:response, body: { 'id' => screening_id, 'name' => 'Submitted Screening' })
    end

    it 'responds with response body' do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings/#{screening_id}/submit", :post)
        .and_return(response)
      submitted_screening = described_class.submit(security_token, screening_id)
      expect(submitted_screening.id).to eq(screening_id)
      expect(submitted_screening.name).to eq('Submitted Screening')
    end
  end
end
