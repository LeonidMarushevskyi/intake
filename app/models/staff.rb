# frozen_string_literal: true

# Model for storing Intake person information.
class Staff
  include Virtus.model

  attribute :staff_id
  attribute :first_name
  attribute :last_name
  attribute :middle_initial
  attribute :county
end
