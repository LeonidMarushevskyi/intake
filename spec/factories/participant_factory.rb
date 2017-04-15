# frozen_string_literal: true
FactoryGirl.define do
  factory :participant, class: Participant do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }

    trait :unknown do
      first_name { nil }
      last_name { nil }
    end
  end
end
