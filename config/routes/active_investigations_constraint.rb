# frozen_string_literal: true

module Routes
  # ActiveInvestigationsConstraint provides a feature constraint
  # for available routes while investigations are active
  class ActiveInvestigationsConstraint
    def self.matches?(_request)
      Feature.active?(:investigations)
    end
  end
end
