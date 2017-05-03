# frozen_string_literal: true
module Routes
  # ActiveReferralSubmitConstraint provides a feature constraint
  # for available routes while release one is inactive
  class ActiveReferralSubmitConstraint
    def self.matches?(_request)
      Feature.active?(:referral_submit)
    end
  end
end
