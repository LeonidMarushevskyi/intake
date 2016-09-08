# frozen_string_literal: true

# Referral utility module used to minimise presentation logic in views
module ReferralHelper
  def name_and_reference(referral)
    "#{referral.name} - #{referral.reference}"
  end
end
