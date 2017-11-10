# frozen_string_literal: true

# Model for storing Intake screening information.
class Screening # :nodoc:
  include Virtus.model
  include ActiveModel::Model

  attribute :additional_information
  attribute :communication_method
  attribute :ended_at
  attribute :id
  attribute :incident_county, String
  attribute :incident_date
  attribute :location_type
  attribute :name
  attribute :reference
  attribute :referral_id
  attribute :report_narrative
  attribute :safety_alerts, Array
  attribute :safety_information, String
  attribute :screening_decision
  attribute :screening_decision_detail
  attribute :access_restrictions
  attribute :restrictions_rationale
  attribute :assignee_staff_id
  attribute :started_at
  attribute :indexable, Boolean, default: lambda { |_screening, _attribute|
    Feature.inactive?(:release_two)
  }
  attribute :address, Address, default: ->(_, _) { Address.new }
  attribute :assignee, String
  attribute :cross_reports, Array[CrossReport]
  attribute :participants, Array[Participant]
  attribute :allegations, Array[Allegation]
end
