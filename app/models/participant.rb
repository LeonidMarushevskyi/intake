# frozen_string_literal: true

# Model for storing Intake participant information.
class Participant
  include Virtus.model

  attribute :id
  attribute :date_of_birth
  attribute :first_name
  attribute :gender
  attribute :last_name
  attribute :middle_name
  attribute :ssn
  attribute :name_suffix
  attribute :phone_numbers, Array[PhoneNumber]
  attribute :addresses, Array[Address]
  attribute :legacy_id
  attribute :legacy_source_table
  attribute :screening_id
  attribute :roles, Array[String]
  attribute :languages, Array
  attribute :races, Array
  attribute :ethnicity, Ethnicity, default: ->(_person, _attribute) { Ethnicity.new }
end
