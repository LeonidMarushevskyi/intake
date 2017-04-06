# frozen_string_literal: true

# Model for storing Intake participant information.
class Participant
  include Virtus.model

  attribute :id
  attribute :date_of_birth
  attribute :first_name
  attribute :gender
  attribute :last_name
  attribute :ssn
  attribute :phone_numbers, Array[PhoneNumber]
  attribute :addresses, Array[Address]
  attribute :person_id
  attribute :screening_id
  attribute :roles, Array[String]
end
