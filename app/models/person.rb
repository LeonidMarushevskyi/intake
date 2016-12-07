# frozen_string_literal: true

# Model for storing Intake person information.
class Person
  include Virtus.model

  attribute :id
  attribute :date_of_birth
  attribute :first_name
  attribute :gender
  attribute :last_name
  attribute :middle_name
  attribute :ssn
  attribute :name_suffix

  attribute :address, Address
  attribute :phone_numbers, Array[PhoneNumber]
end
