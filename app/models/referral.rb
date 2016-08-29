# frozen_string_literal: true

# Model for storing Intake referral information.
class Referral # :nodoc:
  include Her::Model
  use_api API_V1

  has_one :referral_address

  attributes :ended_at,
             :incident_date,
             :method_of_referral,
             :started_at,
             :name,
             :location_type
end
