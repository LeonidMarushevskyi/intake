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
        :access_restrictions,
        :restrictions_rationale,
        :assignee_staff_id,
        :started_at,
        cross_reports: [
          :id,
          :county_id,
          :inform_date,
          :method,
          agencies: %i[id type]
        ],
        address: %i[id city state street_address zip],
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
        new_screening = Screening.new(
          reference: LUID.generate.first,
          assignee: build_assignee_name(session),
          assignee_staff_id: build_staff_id(session)
        )
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

      def build_staff_id(session)
        user_details = session[:user_details]
        return nil unless user_details

        user_details.staff_id
      end

      def build_assignee_name(session)
        user_details = session[:user_details]
        return nil unless user_details

        middle_initial = user_details['middle_initial']

        assignee_name = user_details.first_name.dup
        assignee_name << " #{middle_initial}." unless middle_initial.blank?
        assignee_name << " #{user_details.last_name}"
        assignee_name << " - #{user_details.county}"

        assignee_name.strip
      end
    end
  end
end
