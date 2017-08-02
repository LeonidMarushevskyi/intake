# frozen_string_literal: true

require 'rails_helper'

describe Address do
  describe 'as_json' do
    it 'returns the attributes of a address as a hash' do
      attributes = {
        id: '1',
        street_address: '123 Fake St',
        city: 'NY',
        state: 'NY',
        zip: '11222',
        type: 'Work'
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json.with_indifferent_access
      ).to include({
        id: '1',
        street_address: '123 Fake St',
        city: 'NY',
        state: 'NY',
        zip: '11222',
        type: 'Work'
      }.with_indifferent_access)
    end
  end
end
