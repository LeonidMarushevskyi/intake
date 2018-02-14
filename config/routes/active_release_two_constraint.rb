# frozen_string_literal: true

module Routes
  # ActiveReleaseTwoConstraint provides a feature constraint
  # for available routes while release two is active
  class ActiveReleaseTwoConstraint
    def self.matches?(_request)
      Feature.active?(:release_two)
    end
  end
end
