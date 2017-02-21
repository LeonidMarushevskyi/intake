# frozen_string_literal: true

# Screening Controller handles all service request for
# the creation and modification of screening objects.
module Api
  module V1
    class ScreeningsController < ApplicationController # :nodoc:
      PERMITTED_PARAMS = [
        :communication_method,
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
        address: [
          :id,
          :city,
          :state,
          :street_address,
          :zip
        ]
      ].freeze

      def create
        new_screening = Screening.new(reference: LUID.generate.first)
        screening = ScreeningRepository.create(new_screening)
        render json: screening
      end

      def update
        existing_screening = Screening.new(screening_params.to_h)
        updated_screening = ScreeningRepository.update(existing_screening)
        render json: updated_screening
      end

      def show
        screening = ScreeningRepository.find(params[:id])
        render json: screening
      end

      def index
        screenings = ScreeningRepository.search(screening_index_params.to_h)
        render json: screenings
      end

      private

      def screening_index_params
        params.permit(response_times: [], screening_decisions: [])
      end

      def screening_params
        params.require(:screening).permit(*PERMITTED_PARAMS)
      end
    end
  end
end
