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
    respond_to do |format|
      format.html
      format.json do
        referrals = ReferralsRepo.search(query).results
        render json: referrals
      end
    end
  end

  private

  def query
    { query: { filtered: { filter: { bool: { must: search_terms } } } } }
  end

  def search_terms
    terms = []

    terms << { terms: { response_time: response_times } } if response_times
    terms << { terms: { screening_decision: screening_decisions } } if screening_decisions

    terms
  end

  def response_times
    params[:response_times]
  end

  def screening_decisions
    params[:screening_decisions]
  end

  def referral_params
    params.require(:referral).permit(*PERMITTED_PARAMS)
  end
end
