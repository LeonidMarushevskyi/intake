# frozen_string_literal: true

FactoryGirl.define do
  factory :person_search, class: PersonSearch do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    ssn { FFaker::SSN.ssn }
    date_of_birth { Faker::Date.between(30.years.ago, 25.years.ago) }
  end
end
