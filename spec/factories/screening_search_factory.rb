# frozen_string_literal: true

FactoryGirl.define do
  factory :screening_search, class: ScreeningSearch do
    skip_create

    after :create do |screening_search|
      screening_search.id = SecureRandom.random_number(1_000_000_000).to_s
    end
  end
end
