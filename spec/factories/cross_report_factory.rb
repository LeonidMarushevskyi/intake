# frozen_string_literal: true

FactoryGirl.define do
  factory :cross_report, class: CrossReport do
    skip_create

    agency_code { FFaker::Lorem.sentence(3) }
    reported_on { Faker::Date.between(1.year.ago, 1.day.ago).to_s(:db) }

    agency_type do
      [
        'Department of justice',
        'Law enforcement',
        'District attorney',
        'Licensing'
      ].sample
    end

    communication_method do
      [
        'Child Abuse Form',
        'Electronic Report',
        'Suspected Child Abuse Report',
        'Telephone Report'
      ].sample
    end

    trait :unpopulated do
      agency_type { nil }
      agency_code { nil }
      communication_method { nil }
      reported_on nil
    end

    trait :invalid do
      agency_code { nil }
      communication_method { nil }
      reported_on nil
    end
  end
end
