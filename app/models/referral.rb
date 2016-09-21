# frozen_string_literal: true

# Model for storing Intake referral information.
class Referral # :nodoc:
  include Her::Model
  use_api API_V1
  ASSOCIATIONS = [:address].freeze

  has_one :address

  attributes :ended_at,
    :incident_county,
    :incident_date,
    :involved_people,
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

  def involved_people
    involved_people = attributes[:involved_people] || []
    involved_people.map do |involved_people_attributes|
      Person.new(involved_people_attributes)
    end
  end
end
