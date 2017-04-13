# frozen_string_literal: true
require 'rails_helper'

describe ScreeningRepository do
  describe '.create' do
    let(:screening_id) { '11' }
    let(:response) { double(:response, body: { 'id' => screening_id, 'name' => 'New Screening' }) }
    let(:screening) { double(:screening, as_json: { 'id' => nil, 'name' => 'New Screening' }) }

    before do
      expect(API).to receive(:make_api_call)
        .with('/api/v1/screenings', :post, 'name' => 'New Screening')
        .and_return(response)
    end

    it 'returns the created screening' do
      created_screening = described_class.create(screening)
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
        .with("/api/v1/screenings/#{screening_id}", :get)
        .and_return(response)
    end

    it 'returns the existing screening' do
      existing_screening = described_class.find(screening_id)
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
          .with("/api/v1/screenings/#{screening_id}", :put, 'name' => 'Updated Screening')
          .and_return(response)
      end

      it 'returns the updated screening' do
        updated_screening = described_class.update(screening)
        expect(updated_screening.id).to eq(screening_id)
        expect(updated_screening.name).to eq('Updated Screening')
      end
    end

    context 'when screening has no id' do
      let(:screening_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(screening)
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
        .with("/api/v1/screenings?#{search_terms.to_query}", :get)
        .and_return(response)
    end

    it 'returns the screening results' do
      screening_results = described_class.search(search_terms)
      expect(screening_results.first.id).to eq('1')
      expect(screening_results.last.id).to eq('2')
    end
  end
end
