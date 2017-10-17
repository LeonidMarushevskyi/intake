# frozen_string_literal: true

# Model for storing Intake screening cross report information.
class CrossReport
  include Virtus.model

  attribute :county, String
  attribute :agency_type, String
  attribute :agency_code, String
  attribute :communication_method, String
  attribute :reported_on, String
end
