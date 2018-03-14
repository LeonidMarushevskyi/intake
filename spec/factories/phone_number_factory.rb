# frozen_string_literal: true

FactoryBot.define do
  factory :phone_number, class: PhoneNumber do
    skip_create
    id { SecureRandom.random_number(1_000_000_000).to_s }
    type { %w[Cell Home Work Other].sample }
    number { ['571-456-7689', '352.789.1245', '9436587138', '943 549 6437'].sample }
  end
end
