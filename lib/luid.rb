# frozen_string_literal: true

module LUID # :nodoc: Locally Unique IDentifier
  # Returns an array of 3 elements each consisting of
  # a unique LUID of alphanumeric characters.
  def self.generate
    sample_set = ('A'..'Z').to_a + (0..9).to_a
    Array.new(3) do
      (1..6).map { sample_set.sample }.join
    end
  end
end
