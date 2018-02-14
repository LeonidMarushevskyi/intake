# frozen_string_literal: true

module Routes
  # InactiveReleaseTwoConstraint provides a feature constraint
  # for available routes while release two is inactive
  class InactiveReleaseTwoConstraint
    def self.matches?(_request)
      Feature.inactive?(:release_two)
    end
  end
end
