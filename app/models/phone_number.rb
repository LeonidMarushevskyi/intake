# frozen_string_literal: true

# Model for storing Intake phone number information.
class PhoneNumber # :nodoc:
  include Virtus.model
  include ActiveModel::Model

  attribute :id
  attribute :number
  attribute :type
  attribute :created_at
  attribute :updated_at
end
