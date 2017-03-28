# frozen_string_literal: true
require 'rails_helper'

describe Screening do
  describe 'as_json' do
    it 'returns the attributes of a screening as a hash' do
      attributes = {
        additional_information: 'this is why',
        communication_method: 'phone',
        ended_at: '2016-08-13T11:00:00.000Z',
        id: '2',
        incident_county: 'sacramento',
        incident_date: '2016-08-11',
        location_type: nil,
        name: 'Little Shop Of Horrors',
        reference: 'My Bad!',
        report_narrative: 'Narrative 123 test',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3 days',
        started_at: '2016-08-13T10:00:00.000Z',
        address: {
          id: '1',
          street_address: '123 Fake St',
          city: 'NY',
          state: 'NY',
          zip: '11222'
        },
        participants: [
          {
            id: '1',
            first_name: 'Homer',
            last_name: 'Simpson',
            person_id: '3',
            roles: ['Victim'],
            screening_id: '2',
            addresses: [
              {
                id: '1',
                street_address: '123 Fake St',
                city: 'NY',
                state: 'NY',
                zip: '11222',
                type: 'Work'
              }
            ]
          }
        ]
      }.with_indifferent_access
      expect(
        described_class.new(attributes).as_json.with_indifferent_access
      ).to include({
        communication_method: 'phone',
        additional_information: 'this is why',
        ended_at: '2016-08-13T11:00:00.000Z',
        id: '2',
        incident_county: 'sacramento',
        incident_date: '2016-08-11',
        location_type: nil,
        name: 'Little Shop Of Horrors',
        reference: 'My Bad!',
        report_narrative: 'Narrative 123 test',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3 days',
        started_at: '2016-08-13T10:00:00.000Z',
        address: include(
          id: '1',
          street_address: '123 Fake St',
          city: 'NY',
          state: 'NY',
          zip: '11222'
        ),
        participants: include(
          id: '1',
          date_of_birth: nil,
          first_name: 'Homer',
          gender: nil,
          last_name: 'Simpson',
          ssn: nil,
          person_id: '3',
          roles: ['Victim'],
          screening_id: '2',
          addresses: include(
            id: '1',
            street_address: '123 Fake St',
            city: 'NY',
            state: 'NY',
            zip: '11222',
            type: 'Work'
          )
        )
      }.with_indifferent_access)
    end
  end
end
