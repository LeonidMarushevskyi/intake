# frozen_string_literal: true

# Model for storing Intake person information.
class Person # :nodoc:
  include Her::Model
  include ActiveModel::Serializers::JSON

  use_api API_V1
  ASSOCIATIONS = [:address].freeze

  has_one :address

  attributes :date_of_birth,
    :first_name,
    :gender,
    :last_name,
    :ssn

  def self.to_params(attributes)
    ASSOCIATIONS.each do |association_key|
      association = attributes[association_key]
      attributes[association_key] = association.attributes if association.is_a?(Her::Model)
    end
    attributes
  end
end
