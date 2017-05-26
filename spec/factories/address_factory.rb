# frozen_string_literal: true

FactoryGirl.define do
  factory :address, class: Address do
    skip_create

    after :create do |address|
      address.id = SecureRandom.random_number(1_000_000_000).to_s
    end
  end
end
