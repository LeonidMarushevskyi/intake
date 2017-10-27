# frozen_string_literal: true

FactoryGirl.define do
  factory :cross_report, class: CrossReport do
    skip_create

    inform_date { Faker::Date.between(1.year.ago, 1.day.ago).to_s(:db) }

    add_attribute(:method) do
      [
        'Child Abuse Form',
        'Electronic Report',
        'Suspected Child Abuse Report',
        'Telephone Report'
      ].sample
    end

    trait :unpopulated do
      agencies { [] }
      communication_method { nil }
      reported_on nil
    end
  end
end
