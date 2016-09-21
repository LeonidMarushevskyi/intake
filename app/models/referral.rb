# frozen_string_literal: true

# Model for storing Intake referral information.
class Referral # :nodoc:
  include Her::Model
  use_api API_V1
  ASSOCIATIONS = [:address, :involved_people].freeze

  has_one :address
  has_many :involved_people, class_name: 'Person'

  attributes :ended_at,
    :incident_county,
    :incident_date,
    :location_type,
    :method_of_referral,
    :name,
    :narrative,
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
