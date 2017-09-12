# frozen_string_literal: true

require 'rails_helper'

describe Race do
  describe 'as_json' do
    it 'returns the attributes of race as a hash' do
      attributes = {
        race: 'Asian',
        race_detail: 'Cambodian'
      }
      expect(
        described_class.new(attributes).as_json
      ).to include('race' => 'Asian',
                   'race_detail' => 'Cambodian')
    end
  end
end
