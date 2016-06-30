require 'samples/kitten'

FactoryGirl.define do
  factory :kitten, class: SampleKitten do
    name { ['Fluffy', 'Mittens', 'Boots', 'Beastie', 'Gustav Mahler'].sample }
    color { ['black', 'white', 'grey', 'orange', 'magenta'].sample }
  end
end
