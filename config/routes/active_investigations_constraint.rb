# frozen_string_literal: true

module Routes
  # InactiveReleaseOneAndTwoConstraint provides a feature constraint
  # for available routes while release_one and release two are inactive
  class ActiveInvestigationsConstraint
    def self.matches?(_request)
      Feature.active?(:investigations)
    end
  end
end
