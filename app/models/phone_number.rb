# frozen_string_literal: true

# Model for storing Intake phone number information.
class PhoneNumber # :nodoc:
  include Virtus.model
  include ActiveModel::Model

  attribute :id
  attribute :phone_number
  attribute :phone_number_type
  attribute :created_at
  attribute :updated_at
end
