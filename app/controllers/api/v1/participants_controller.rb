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
        :first_name,
        :middle_name,
        :last_name,
        :name_suffix,
        :gender,
        :legacy_id,
        :screening_id,
        :ssn,
        addresses: %i[
          id
          street_address
          city
          state
          zip
          type
        ],
        phone_numbers: %i[
          id
          number
          type
        ],
        roles: [],
        languages: []
      ].freeze

      def create
        participant = Participant.new(participant_params.to_h)
        created_participant = ParticipantRepository.create(session[:security_token], participant)
        render json: created_participant
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
