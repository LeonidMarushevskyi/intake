# frozen_string_literal: true

class ScreeningSearch # :nodoc:
  include Virtus.model

  attribute :id
  attribute :name
  attribute :reference
  attribute :started_at
  attribute :screening_decision
  attribute :screening_decision_detail
  attribute :assignee
end
