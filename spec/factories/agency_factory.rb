# frozen_string_literal: true

FactoryBot.define do
  factory :agency, class: Agency do
    skip_create

    id { FFaker::Lorem.word }
    type do
      %w[
        COMMUNITY_CARE_LICENSING
        COUNTY_LICENSING
        DISTRICT_ATTORNEY
        LAW_ENFORCEMENT
      ].sample
    end
  end
end
