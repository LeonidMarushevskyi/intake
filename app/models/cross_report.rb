# frozen_string_literal: true

# Model for storing Intake screening cross report information.
class CrossReport
  include Virtus.model

  attribute :agency_type, String
  attribute :agency_name, String
  attribute :communication_method, String
  attribute :reported_on, String
end
