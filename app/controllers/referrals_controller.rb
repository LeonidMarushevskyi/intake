# frozen_string_literal: true

# Referral Controller handles all service request for
# the creation and modification of referral objects.
class ReferralsController < ApplicationController # :nodoc:
  def create
    @referral = ReferralCreator.create
    render :edit
  end

  def edit

  end
end
