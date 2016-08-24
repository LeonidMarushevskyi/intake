# frozen_string_literal: true

# Referral Controller handles all service request for
# the creation and modification of referral objects.
class ReferralsController < ApplicationController # :nodoc:
  def create
    @referral = ReferralCreator.create
    redirect_to referral_path(id: @referral['id'])
  end

  def update
    @referral = Referral.save_existing(
      params[:id],
      referral_params.to_h
    )
    redirect_to referral_path(@referral)
  end

  def edit
    @referral = Referral.find(params[:id])
  end

  def show
    @referral = Referral.find(params[:id])
  end

  private

  def referral_params
    params.require(:referral).permit(
      :street_address,
      :city,
      :ended_at,
      :incident_date,
      :location_type,
      :method_of_referral,
      :name,
      :reference,
      :started_at,
      :state,
      :zip
    )
  end
end
