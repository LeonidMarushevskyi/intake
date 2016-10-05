# frozen_string_literal: true

# Referral Controller handles all service request for
# the creation and modification of referral objects.
class ReferralsController < ApplicationController # :nodoc:
  PERMITTED_PARAMS = [
    :ended_at,
    :incident_county,
    :incident_date,
    :location_type,
    :method_of_referral,
    :name,
    :narrative,
    :reference,
    :response_time,
    :screening_decision,
    :started_at,
    address: [
      :id,
      :city,
      :state,
      :street_address,
      :zip
    ],
    involved_person_ids: []
  ].freeze

  def create
    @referral = Referral.create(reference: LUID.generate.first)
    redirect_to edit_referral_path(@referral)
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
    @involved_people = @referral.involved_people.to_a
  end

  def show
    @referral = Referral.find(params[:id])
    @involved_people = @referral.involved_people.to_a
  end

  def index
    @referrals = Referral.all
  end

  private

  def referral_params
    params.require(:referral).permit(*PERMITTED_PARAMS)
  end
end
