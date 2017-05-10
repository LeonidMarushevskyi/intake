# frozen_string_literal: true

require 'rails_helper'

describe PhoneNumber do
  describe 'as_json' do
    it 'returns the attributes of a phone number as a hash' do
      attributes = {
        id: '1',
        number: '111-111-1111',
        type: 'Cell'
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json.with_indifferent_access
      ).to include({
        id: '1',
        number: '111-111-1111',
        type: 'Cell'
      }.with_indifferent_access)
    end
  end
end
