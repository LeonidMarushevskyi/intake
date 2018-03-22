# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class ParticipantsController < ApiController # :nodoc:
      respond_to :json

      PERMITTED_PARAMS = [
        :id,
        :date_of_birth,
        :approximate_age,
        :approximate_age_units,
        :first_name,
        :middle_name,
        :last_name,
        :name_suffix,
        :gender,
        :legacy_id,
        :legacy_friendly_id,
        :legacy_source_table,
        :legacy_friendly_table,
        :screening_id,
        :ssn,
        :sealed,
        :sensitive,
        addresses: %i[id legacy_id legacy_source_table street_address city state zip type],
        legacy_descriptor: %i[
          id
          legacy_id
          legacy_last_updated
          legacy_table_description
          legacy_table_name
          legacy_ui_id
        ],
        phone_numbers: %i[id number type],
        races: %i[race race_detail],
        roles: [],
        languages: [],
        ethnicity: [:hispanic_latino_origin, ethnicity_detail: []]
      ].freeze

      def create
        participant = Participant.new(participant_params.to_h)

        begin
          created_participant = ParticipantRepository.create(session[:security_token], participant)
          render json: created_participant
        rescue ParticipantRepository::AuthenticationError
          render json: { status: 403 }, status: 403
        end
      end

      def update
        existing_participant = Participant.new(participant_params.to_h)
        updated_participant = ParticipantRepository.update(
          session[:security_token],
          existing_participant
        )
        render json: updated_participant
      end

      def destroy
        ParticipantRepository.delete(session[:security_token], params[:id])
      end

      def participant_params
        params.require(:participant).permit(*PERMITTED_PARAMS)
      end
    end
  end
end
