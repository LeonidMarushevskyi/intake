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

  def edit
    @screening = ScreeningRepository.find(params[:id])
    @participants = @screening.participants.to_a
  end

  def show
    @screening = ScreeningRepository.find(params[:id])
    @participants = @screening.participants.to_a

    render :show
  end

  private

  def screening_index_params
    params.permit(response_times: [], screening_decisions: [])
  end

  def screening_params
    params.require(:screening).permit(*PERMITTED_PARAMS)
  end
end
