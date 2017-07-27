# frozen_string_literal: true

require 'rails_helper'

describe Staff do
  describe 'as_json' do
    it 'returns the attributes of a staff person as a hash' do
      attributes = {
        staff_id: '1',
        first_name: 'Homer',
        middle_initial: 'J',
        last_name: 'Simpson',
        county: 'Sacramento'
      }.with_indifferent_access
      expect(described_class.new(attributes).as_json).to eq({
        staff_id: '1',
        first_name: 'Homer',
        middle_initial: 'J',
        last_name: 'Simpson',
        county: 'Sacramento'
      }.with_indifferent_access)
    end
  end
end
