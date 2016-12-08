# frozen_string_literal: true

# Model for storing Intake address information.
class Address # :nodoc:
  include Virtus.model
  include ActiveModel::Model

  attribute :city
  attribute :id
  attribute :state
  attribute :street_address
  attribute :zip
  attribute :type
end
