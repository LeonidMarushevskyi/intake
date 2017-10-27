# frozen_string_literal: true

# Model for storing Intake screening cross report agency information.
class Agency
  include Virtus.model

  attribute :id, String
  attribute :type, String
end
