# frozen_string_literal: true

FactoryGirl.define do
  factory :participant, class: Participant do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    gender { %w[male female].sample }
    ssn { FFaker::SSN.ssn }
    date_of_birth { Faker::Date.between(30.years.ago, 25.years.ago) }

    languages do
      [
        'American Sign Language',
        'Arabic',
        'Armenian',
        'Cambodian',
        'Cantonese',
        'English',
        'Farsi',
        'Filipino',
        'French',
        'German',
        'Hawaiian',
        'Hebrew',
        'Hmong',
        'Ilacano',
        'Indochinese',
        'Italian',
        'Japanese',
        'Korean',
        'Lao',
        'Mandarin',
        'Mien',
        'Other Chinese',
        'Other Non-English',
        'Polish',
        'Portuguese',
        'Romanian',
        'Russian',
        'Samoan',
        'Sign Language (Not ASL)',
        'Spanish',
        'Tagalog',
        'Thai',
        'Turkish',
        'Vietnamese'
      ].sample
    end

    trait :unknown do
      first_name { nil }
      last_name { nil }
    end

    trait :reporter do
      roles { ['Mandated Reporter'] }
    end

    trait :victim do
      roles { ['Victim'] }
    end

    trait :perpetrator do
      roles { ['Perpetrator'] }
    end
  end
end
