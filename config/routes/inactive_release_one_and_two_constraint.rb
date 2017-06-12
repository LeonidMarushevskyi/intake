# frozen_string_literal: true

module Routes
  # InactiveReleaseOneAndTwoConstraint provides a feature constraint
  # for available routes while release_one and release two are inactive
  class InactiveReleaseOneAndTwoConstraint
    def self.matches?(_request)
      Feature.inactive?(:release_one) && Feature.inactive?(:release_two)
    end
  end
end
