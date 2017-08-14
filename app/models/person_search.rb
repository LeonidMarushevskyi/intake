# frozen_string_literal: true

# Model for storing Intake person information.
class PersonSearch < Person
  attribute :highlight
  attribute :legacy_source_table
  attribute :legacy_descriptor
  attribute :is_sensitive
end
