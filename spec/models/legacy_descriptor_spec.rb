# frozen_string_literal: true

require 'rails_helper'

describe LegacyDescriptor do
  describe 'as_json' do
    it 'returns the attributes as a hash' do
      attributes = {
        id: '1',
        legacy_id: '8dCC54DWFdsDF24',
        legacy_last_updated: '2010-10-01T22:26:42.000Z',
        legacy_table_description: 'Client',
        legacy_table_name: 'CLIENT_T',
        legacy_ui_id: '0947-1946-9435-0081454'
      }.with_indifferent_access
      expect(described_class.new(attributes).as_json).to eq({
        id: '1',
        legacy_id: '8dCC54DWFdsDF24',
        legacy_last_updated: '2010-10-01T22:26:42.000Z',
        legacy_table_description: 'Client',
        legacy_table_name: 'CLIENT_T',
        legacy_ui_id: '0947-1946-9435-0081454'
      }.with_indifferent_access)
    end
  end
end
