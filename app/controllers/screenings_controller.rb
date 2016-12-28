# frozen_string_literal: true

# Screening Controller handles all service request for
# the creation and modification of screening objects.
class ScreeningsController < ApplicationController # :nodoc:
  PERMITTED_PARAMS = [
    :communication_method,
    :created_at,
    :ended_at,
    :id,
    :incident_county,
    :incident_date,
    :location_type,
    :name,
    :reference,
    :report_narrative,
    :response_time,
    :screening_decision,
    :started_at,
    :updated_at,
    address: [
      :id,
      :city,
      :state,
      :street_address,
      :zip
    ]
  ].freeze

  def create
    respond_to do |format|
      format.json do
        new_screening = Screening.new(reference: LUID.generate.first)
        screening = ScreeningRepository.create(new_screening)
        render json: screening
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        existing_screening = Screening.new(screening_params.to_h)
        updated_screening = ScreeningRepository.update(existing_screening)
        render json: updated_screening
      end
    end
  end

  def edit
    @screening = ScreeningRepository.find(params[:id])
    @participants = @screening.participants.to_a
  end

  def show
    @screening = ScreeningRepository.find(params[:id])
    @participants = @screening.participants.to_a

    respond_to do |format|
      format.html do
        render :show
      end
      format.json do
        render json: @screening
      end
    end
  end

  def index
    respond_to do |format|
      format.html
      format.json do
        screenings = ScreeningRepository.search(query)
        render json: screenings
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

  def screening_params
    params.require(:screening).permit(*PERMITTED_PARAMS)
  end
end
