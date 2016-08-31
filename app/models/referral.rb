# frozen_string_literal: true

# Model for storing Intake referral information.
class Referral # :nodoc:
  include Her::Model
  use_api API_V1
  ASSOCIATIONS = [:address]

  has_one :address

  attributes :ended_at,
    :incident_date,
    :method_of_referral,
    :started_at,
    :name,
    :location_type

  def self.to_params(attributes)
    ASSOCIATIONS.each do |association_key|
      association = attributes[association_key]
      attributes[association_key] = association.attributes if association.is_a?(Her::Model)
    end
    attributes
  end
end
