# frozen_string_literal: true

FactoryBot.define do
  factory :allegation, class: Allegation do
    skip_create

    after :create do |allegation|
      allegation.id = SecureRandom.random_number(1_000_000_000).to_s
    end
  end
end
