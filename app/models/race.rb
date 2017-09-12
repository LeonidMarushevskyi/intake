# frozen_string_literal: true

# Model for storing Intake race information.
class Race # :nodoc:
  include Virtus.model
  include ActiveModel::Model

  attribute :race, String
  attribute :race_detail, String
end
