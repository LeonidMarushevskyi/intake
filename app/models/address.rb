# frozen_string_literal: true

# Model for storing Intake address information.
class Address # :nodoc:
  include Her::Model

  attributes :street_address, :city, :state, :zip
end
