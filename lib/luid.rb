# frozen_string_literal: true
module LUID # Locally Unique IDentifier
  def self.generate
    sample_set = ('A'..'Z').to_a + (0..9).to_a
    Array.new(3) do
      (1..6).map { sample_set.sample }.join
    end
  end
end
