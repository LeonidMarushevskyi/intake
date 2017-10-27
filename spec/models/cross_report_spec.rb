# frozen_string_literal: true

require 'rails_helper'

describe CrossReport do
  describe 'as_json' do
    it 'returns the attributes of a cross report as a hash' do
      attributes = {
        method: 'Suspected Child Abuse Report',
        inform_date: '2017-03-15',
        county_id: '1086',
        agencies: [
          {
            id: 'Ad4ATcY00E',
            type: 'LAW_ENFORCEMENT'
          },
          {
            id: '12vhdlh00i',
            type: 'DEPARTMENT_OF_JUSTICE'
          }
        ]
      }
      expect(
        described_class.new(attributes).as_json
      ).to match(
        a_hash_including(
          'filed_out_of_state' => false,
          'method' => 'Suspected Child Abuse Report',
          'inform_date' => '2017-03-15',
          'county_id' => '1086',
          'agencies' => match_array([
                                      a_hash_including(
                                        'id' => 'Ad4ATcY00E',
                                        'type' => 'LAW_ENFORCEMENT'
                                      ),
                                      a_hash_including(
                                        'id' => '12vhdlh00i',
                                        'type' => 'DEPARTMENT_OF_JUSTICE'
                                      )
                                    ])
        )
      )
    end
  end
end
