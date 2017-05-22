# frozen_string_literal: true

FactoryGirl.define do
  factory :screening, class: Screening do
    skip_create

    after :create do |screening|
      screening.id = SecureRandom.random_number(1_000_000_000).to_s
    end

    association :address, factory: :address
    participants { [] }
    safety_alerts do
      [
        'Dangerous Animal on Premises',
        'Firearms in Home',
        'Gang Affiliation or Gang Activity',
        'Hostile, Aggressive Client',
        'Remote or Isolated Location',
        'Severe Mental Health Status',
        'Threat or Assault on Staff Member',
        'Other'
      ].sample
    end
    safety_information { ['Scary and dangerous', 'Fear of gangs', 'Feeling tense'].sample }
  end
end
