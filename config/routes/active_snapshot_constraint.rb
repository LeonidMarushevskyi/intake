# frozen_string_literal: true

module Routes
  # ActiveSnapshotConstraint provides a feature constraint
  # for available routes while snapshot is active
  class ActiveSnapshotConstraint
    def self.matches?(_request)
      Feature.active?(:snapshot)
    end
  end
end
