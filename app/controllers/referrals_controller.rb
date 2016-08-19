# frozen_string_literal: true

# Referral Controller handles all service request for
# the creation and modification of referral objects.
class ReferralsController < ApplicationController # :nodoc:
  def create
    @referral = ReferralCreator.create
    redirect_to edit_referral_path(@referral['reference'])
  end

  def edit
    @referral_reference = params['id']
  end
end
