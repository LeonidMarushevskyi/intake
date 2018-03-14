# frozen_string_literal: true

FactoryBot.define do
  factory :staff, class: Staff do
    skip_create

    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    county { ['Sacramento', 'Los Angeles', 'Alpine'].sample }
  end
end
