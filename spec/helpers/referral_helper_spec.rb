# frozen_string_literal: true
require 'rails_helper'

describe ReferralHelper do
  describe '#name_and_reference' do
    it 'returns the name hypenated with reference' do
      referral = double(:referral, name: 'Hello', reference: '123')
      expect(helper.name_and_reference(referral)).to eq('Hello - 123')
    end
  end
end
