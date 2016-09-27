# frozen_string_literal: true
require 'rails_helper'

describe ReferralPresenter do
  describe '#name_and_reference' do
    it 'returns the name hypenated with reference' do
      referral = double(:referral, name: 'Hello', reference: '123')
      expect(described_class.name_and_reference(referral)).to eq('Hello - 123')
    end
  end

  describe '#involved_people_attributes' do
    it 'returns a hash of id, first_name and last_name' do
      bart = Person.new(id: 1, first_name: 'Bart', last_name: 'Simpson')
      lisa = Person.new(id: 1, first_name: 'Lisa', last_name: 'Simpson')
      referral = Referral.new
      allow(referral).to receive(:involved_people).and_return([bart, lisa])

      attrs = described_class.involved_people_attributes(referral)

      expect(attrs).to include(
        id: bart.id,
        first_name: bart.first_name,
        last_name: bart.last_name
      )
      expect(attrs).to include(
        id: lisa.id,
        first_name: lisa.first_name,
        last_name: lisa.last_name
      )
    end
  end
end
