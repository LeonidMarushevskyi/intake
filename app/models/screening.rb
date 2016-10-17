# frozen_string_literal: true

# Model for storing Intake screening information.
class Screening # :nodoc:
  include Her::Model

  use_api API_V1
  ASSOCIATIONS = [:address, :participants].freeze

  has_one :address
  has_many :participants

  attributes :ended_at,
    :incident_county,
    :incident_date,
    :location_type,
    :communication_method,
    :name,
    :report_narrative,
    :response_time,
    :screening_decision,
    :started_at

  def self.to_params(attributes)
    ASSOCIATIONS.each do |association_key|
      association = attributes[association_key]
      attributes[association_key] = association.attributes if association.is_a?(Her::Model)
    end
    attributes
  end
end
