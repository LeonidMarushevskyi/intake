# frozen_string_literal: true

module Routes
  # ActiveReferralSubmitConstraint provides a feature constraint
  # for available routes while referral_submit is active and release_two is not active
  class ActiveReferralSubmitConstraint
    def self.matches?(_request)
      Feature.active?(:referral_submit) && Feature.inactive?(:release_two)
    end
  end
end
