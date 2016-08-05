# frozen_string_literal: true
require 'samples/kitten'

FactoryGirl.define do
  factory :kitten, class: SampleKitten do
    name { ['Fluffy', 'Mittens', 'Boots', 'Beastie', 'Gustav Mahler'].sample }
    color { %w(black white grey orange magenta).sample }
  end
end
