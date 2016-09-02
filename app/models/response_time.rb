# frozen_string_literal: true

module ResponseTime
  ALL = {
    immediate: 'Immediate',
    within_twenty_four_hours: 'Within 24 hours',
    more_than_twenty_four_hours: 'More than 24 hours'
  }.with_indifferent_access.freeze
end
