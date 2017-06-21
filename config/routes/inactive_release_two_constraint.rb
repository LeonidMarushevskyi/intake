# frozen_string_literal: true

module Routes
  # InactiveReleaseOneConstraint provides a feature constraint
  # for available routes while release one is inactive
  class InactiveReleaseTwoConstraint
    def self.matches?(_request)
      Feature.inactive?(:release_two)
    end
  end
end
