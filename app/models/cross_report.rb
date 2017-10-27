# frozen_string_literal: true

# Model for storing Intake screening cross report information.
class CrossReport
  include Virtus.model

  attribute :filed_out_of_state, Boolean, default: false
  attribute :method, String
  attribute :county_id, String
  attribute :agencies, Array[Agency]
  attribute :inform_date, String
end
