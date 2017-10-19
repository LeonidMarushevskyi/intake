# frozen_string_literal: true

# Model for storing Intake person information.
class Ethnicity
  include Virtus.model

  attribute :hispanic_latino_origin, String
  attribute :ethnicity_detail, Array
end
