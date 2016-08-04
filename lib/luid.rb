module LUID # Locally Unique IDentifier
  def self.generate
    sample_set = ('A'..'Z').to_a + (0..9).to_a
    3.times.map do
      (1..6).map { sample_set.sample }.join
    end
  end
end
