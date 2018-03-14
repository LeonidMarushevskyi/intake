# frozen_string_literal: true

FactoryBot.define do
  factory :address, class: Address do
    skip_create

    after :create do |address|
      address.id = SecureRandom.random_number(1_000_000_000).to_s
    end

    trait :with_legacy do
      legacy_id { FFaker::Guid.guid }
      legacy_source_table { 'ADDR_T' }
    end

    trait :complete do
      street_address { FFaker::Address.street_address }
      city { FFaker::Address.city }
      state { FFaker::AddressUS.state_abbr }
      zip { FFaker::AddressUS.zip_code }
      type do
        %w[
          6273
          28
          32
          29
          6272
          30
          31
          6271
          27
        ].sample
      end
    end
  end
end
