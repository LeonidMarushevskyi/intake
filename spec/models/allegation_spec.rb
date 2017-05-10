# frozen_string_literal: true

require 'rails_helper'

describe Allegation do
  describe '#as_json' do
    it 'returns the allegation attributes' do
      attributes = {
        id: '1',
        screening_id: '2',
        victim_id: '3',
        perpetrator_id: '4'
      }
      expect(
        described_class.new(attributes).as_json
      ).to match a_hash_including(
        'id' => '1',
        'screening_id' => '2',
        'victim_id' => '3',
        'perpetrator_id' => '4'
      )
    end
  end
end
