# frozen_string_literal: true

# Model for storing Intake allegation information.
class Allegation # :nodoc:
  include Virtus.model

  attribute :id, String
  attribute :victim_id, String
  attribute :perpetrator_id, String
  attribute :screening_id, String
  attribute :allegation_types, Array
end
