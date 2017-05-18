# frozen_string_literal: true

require 'rails_helper'

describe Screening do
  describe 'new screening object' do
    let(:screening) { described_class.new }
    it ' does not have default cross report values' do
      expect(screening.cross_reports).to be_empty
    end
  end

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
        safety_alerts: ['Firearms in Home', 'Gang Affiliation or Gang Activity'],
        safety_information: 'bad and scary',
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
        cross_reports: [
          {
            agency_type: 'District attorney',
            agency_name: 'SCDA Office'
          },
          {
            agency_type: 'Law enforcement',
            agency_name: nil
          }
        ],
        allegations: [
          {
            id: '1',
            screening_id: '2',
            victim_id: '1',
            perpetrator_id: '4'
          }
        ],
        participants: [
          {
            id: '1',
            first_name: 'Homer',
            last_name: 'Simpson',
            legacy_id: '3',
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
      ).to match a_hash_including(
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
        safety_alerts: array_including(
          'Firearms in Home',
          'Gang Affiliation or Gang Activity'
        ),
        safety_information: 'bad and scary',
        screening_decision: 'promote_to_referral',
        screening_decision_detail: '3 days',
        started_at: '2016-08-13T10:00:00.000Z',
        cross_reports: array_including(
          a_hash_including(
            agency_type: 'District attorney',
            agency_name: 'SCDA Office'
          ),
          a_hash_including(
            agency_type: 'Law enforcement',
            agency_name: nil
          )
        ),
        address: a_hash_including(
          id: '1',
          street_address: '123 Fake St',
          city: 'NY',
          state: 'NY',
          zip: '11222'
        ),
        allegations: array_including(
          a_hash_including(id: '1', screening_id: '2', victim_id: '1', perpetrator_id: '4')
        ),
        participants: array_including(
          a_hash_including(
            id: '1',
            date_of_birth: nil,
            first_name: 'Homer',
            gender: nil,
            last_name: 'Simpson',
            ssn: nil,
            legacy_id: '3',
            roles: ['Victim'],
            screening_id: '2',
            addresses: array_including(
              a_hash_including(
                id: '1',
                street_address: '123 Fake St',
                city: 'NY',
                state: 'NY',
                zip: '11222',
                type: 'Work'
              )
            )
          )
        )
      )
    end
  end
end
