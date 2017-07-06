# frozen_string_literal: true

# Model for storing Intake person information.
class LegacyDescriptor
  include Virtus.model

  attribute :id, String
  attribute :legacy_id, String
  attribute :legacy_last_updated, String
  attribute :legacy_table_description, String
  attribute :legacy_table_name, String
  attribute :legacy_ui_id, String
end
