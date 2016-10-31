# frozen_string_literal: true
require 'rails_helper'

describe Participant do
  describe 'as_json' do
    it 'returns the attributes of a participant as a hash' do
      attributes = {
        id: 1,
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234'
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json
      ).to eq({
        id: 1,
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234'
      }.with_indifferent_access)
    end
  end
end
