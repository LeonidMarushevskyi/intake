# frozen_string_literal: true
require 'rails_helper'

describe ScreeningRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:screening_id) { '11' }
    let(:response) { double(:response, body: { 'id' => screening_id, 'name' => 'New Screening' }) }
    let(:screening) { double(:screening, as_json: { 'id' => nil, 'name' => 'New Screening' }) }

    before do
      expect(API).to receive(:make_api_call)
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
      expect(API).to receive(:make_api_call)
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
        expect(API).to receive(:make_api_call)
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
      { screening_decisions: %w(promote_to_referral screen_out) }
    end

    before do
      expect(API).to receive(:make_api_call)
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
    let(:response) { double(:response, body: involvements) }
    let(:screening_one) { { 'name' => 'New Screening One' } }
    let(:screening_two) { { 'name' => 'New Screening Two' } }
    let(:involvements) { [screening_one, screening_two] }

    before do
      expect(API).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings/#{screening_id}/history_of_involvements", :get)
        .and_return(response)
    end

    it 'returns the history of involvements' do
      involvements = described_class.history_of_involvements(security_token, screening_id)
      expect(involvements[0].name).to eq('New Screening One')
      expect(involvements[1].name).to eq('New Screening Two')
    end
  end

  describe '.submit' do
    let(:screening_id) { '42' }
    it 'makes a post request to /api/v1/screenings/:id/submit' do
      expect(API).to receive(:make_api_call)
        .with(security_token, "/api/v1/screenings/#{screening_id}/submit", :post)
      described_class.submit(security_token, screening_id)
    end
  end
end
