# frozen_string_literal: true
require 'rails_helper'

describe PhoneNumber do
  describe 'as_json' do
    it 'returns the attributes of a phone number as a hash' do
      attributes = {
        id: 1,
        phone_number: '111-111-1111',
        phone_number_type: 'cell',
        created_at: '2016-11-28T21:51:44.354Z',
        updated_at: '2016-11-28T21:51:44.354Z'
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json.with_indifferent_access
      ).to include({
        id: 1,
        phone_number: '111-111-1111',
        phone_number_type: 'cell',
        created_at: '2016-11-28T21:51:44.354Z',
        updated_at: '2016-11-28T21:51:44.354Z'
      }.with_indifferent_access)
    end
  end
end
