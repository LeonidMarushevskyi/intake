# frozen_string_literal: true

require 'rails_helper'

describe ReferralsController do
  describe '#create' do
    let(:referral) { double(:referral, id: 1, reference: '123ABC') }
    before do
      allow(LUID).to receive(:generate).and_return(['123ABC'])
      allow(Referral).to receive(:create).with(reference: '123ABC').and_return(referral)
    end

    it 'assigns referral' do
      post :create
      expect(assigns(:referral)).to eq(referral)
    end

    it 'redirects to show' do
      post :create
      expect(response).to redirect_to(referral_path(assigns(:referral)))
    end
  end

  describe '#edit' do
    let(:referral) { double(:referral) }
    before do
      allow(Referral).to receive(:find).with('1').and_return(referral)
    end

    it 'assigns referral' do
      post :edit, params: { id: 1 }
      expect(assigns(:referral)).to eq(referral)
    end

    it 'renders the edit template' do
      post :edit, params: { id: 1 }
      expect(response).to render_template('edit')
    end
  end

  describe '#show' do
    let(:referral) { double(:referral) }
    before do
      allow(Referral).to receive(:find).with('1').and_return(referral)
    end

    it 'assigns referral' do
      get :show, params: { id: 1 }
      expect(assigns(:referral)).to eq(referral)
    end

    it 'renders the show template' do
      get :show, params: { id: 1 }
      expect(response).to render_template('show')
    end
  end

  describe '#update' do
    let(:referral) { double(:referral) }
    let(:referral_attributes) do
      {
        name: '123 Report',
        incident_county: 'sacramento',
        response_time: 'immediate',
        address: {
          city: 'LA',
          state: 'CA',
          street_address: '123 Fake St',
          zip: '11222'
        }
      }.with_indifferent_access
    end
    before do
      allow(Referral).to receive(:save_existing).with(
        '1',
        referral_attributes
      ).and_return(referral)
    end

    it 'assigns referral' do
      put :update, params: { id: 1, referral: referral_attributes }
      expect(assigns(:referral)).to eq(referral)
    end

    it 'redirects to show' do
      put :update, params: { id: 1, referral: referral_attributes }
      expect(response).to redirect_to(referral_path(assigns(:referral)))
    end
  end
end
