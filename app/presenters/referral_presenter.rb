# frozen_string_literal: true

# Referral presenter used to minimise presentation logic in views
class ReferralPresenter
  def self.name_and_reference(referral)
    "#{referral.name} - #{referral.reference}"
  end
end
