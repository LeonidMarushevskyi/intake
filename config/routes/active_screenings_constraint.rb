# frozen_string_literal: true

module Routes
  # ActiveScreeningConstraint provides a feature constraint
  # for available routes while screenings are active
  class ActiveScreeningsConstraint
    def self.matches?(_request)
      Feature.active?(:screenings)
    end
  end
end
