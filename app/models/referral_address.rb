# frozen_string_literal: true

# Model for storing Intake referral address information.
class ReferralAddress # :nodoc:
  include Her::Model

  has_one :address
end
