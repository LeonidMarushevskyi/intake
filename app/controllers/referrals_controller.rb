# frozen_string_literal: true

# Referral Controller handles all service request for
# the creation and modification of referral objects.
class ReferralsController < ApplicationController # :nodoc:
  def create
    @referral = ReferralCreator.create
    redirect_to referral_path(id: @referral['id'])
  end

  def edit
    @referral = Referral.find(params[:id])
  end

  def show
    @referral = Referral.find(params[:id])
  end
end
