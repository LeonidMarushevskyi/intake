# frozen_string_literal: true

# Referral presenter used to minimise presentation logic in views
class ReferralPresenter
  def self.name_and_reference(referral)
    "#{referral.name} - #{referral.reference}"
  end

  def self.involved_people_attributes(referral)
    referral.involved_people.map do |person|
      {
        id: person.id,
        first_name: person.first_name,
        last_name: person.last_name
      }
    end
  end
end
