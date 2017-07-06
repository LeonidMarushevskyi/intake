# frozen_string_literal: true

FactoryGirl.define do
  factory :legacy_descriptor, class: LegacyDescriptor do
    skip_create

    id { SecureRandom.random_number(1_000_000_000).to_s }
    legacy_id { SecureRandom.hex(10) }
    legacy_last_updated { rand(1..30).days.ago }
    legacy_table_description { 'Client' }
    legacy_table_name { 'CLIENT_T' }
    legacy_ui_id { SecureRandom.uuid }
  end
end
