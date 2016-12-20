# frozen_string_literal: true
FactoryGirl.define do
  factory :person, class: Person do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }
  end
end
