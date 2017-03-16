# frozen_string_literal: true
FactoryGirl.define do
  factory :screening, class: Screening do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }

    association :address, factory: :address
    participants { [] }
  end
end
