# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::SnapshotsController do
  let(:security_token) { 'security_token' }
  let(:staff) { FactoryBot.build(:staff, staff_id: '123') }
  let(:session) do
    {
      'security_token' => security_token,
      'user_details' => staff
    }
  end

  describe 'permitted attributes' do
    describe '#create' do
      before do
        allow(LUID).to receive(:generate).and_return(['123ABC'])
      end
      it 'defaults indexable to true' do
        screening_params = { indexable: true }
        expect(Screening).to receive(:new)
          .with(
            hash_including(indexable: false)
          ).and_call_original
        allow(ScreeningRepository).to receive(:create)
        process :create, method: :post, session: session, params: screening_params
      end
    end
  end

  describe '#create' do
    let(:created_screening) { double(:screening, id: '1') }
    let(:blank_screening) { double(:screening) }
    before do
      allow(LUID).to receive(:generate).and_return(['123ABC'])
      expect(ScreeningRepository).to receive(:create)
        .with(security_token, blank_screening)
        .and_return(created_screening)
    end

    it 'creates and renders screening as json' do
      expect(Screening).to receive(:new)
        .with(reference: '123ABC', indexable: false)
        .and_return(blank_screening)

      process :create, method: :post, session: session
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(created_screening.as_json)
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
end
