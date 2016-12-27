# frozen_string_literal: true
module Routes
  # InactiveReleaseOneConstraint provides a feature constraint
  # for available routes while release one is inactive
  class InactiveReleaseOneConstraint
    def self.matches?(_request)
      Feature.inactive?(:release_one)
    end
  end
end
