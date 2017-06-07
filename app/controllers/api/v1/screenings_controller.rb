# frozen_string_literal: true

# Screening Controller handles all service request for
# the creation and modification of screening objects.
module Api
  module V1
    class ScreeningsController < ApiController # :nodoc:
      PERMITTED_PARAMS = [
        :additional_information,
        :assignee,
        :communication_method,
        :ended_at,
        :id,
        :incident_county,
        :incident_date,
        :location_type,
        :name,
        :reference,
        :report_narrative,
        :safety_information,
        :screening_decision,
        :screening_decision_detail,
        :started_at,
        cross_reports: %i[
          id
          agency_type
          agency_name
          reported_on
          communication_method
        ],
        address: %i[
          id
          city
          state
          street_address
          zip
        ],
        allegations: [
          :id,
          :screening_id,
          :perpetrator_id,
          :victim_id,
          allegation_types: []
        ],
        safety_alerts: []
      ].freeze

      def create
        new_screening = Screening.new(reference: LUID.generate.first)
        screening = ScreeningRepository.create(session[:security_token], new_screening)
        render json: screening
      end

      def update
        existing_screening = Screening.new(screening_params.to_h)
        updated_screening = ScreeningRepository.update(session[:security_token], existing_screening)
        render json: updated_screening
      end

      def show
        screening = ScreeningRepository.find(session[:security_token], params[:id])
        render json: screening
      end

      def index
        screenings = ScreeningRepository.search(
          session[:security_token],
          screening_index_params.to_h
        )
        render json: screenings
      end

      def history_of_involvements
        involvements = ScreeningRepository.history_of_involvements(
          session[:security_token], params[:id]
        )
        render json: involvements
      end

      def submit
        render json: ScreeningRepository.submit(session[:security_token], params[:id])
      end

      private

      def screening_index_params
        params.permit(screening_decisions: [])
      end

      def screening_params
        params.require(:screening).permit(*PERMITTED_PARAMS)
      end
    end
  end
end
