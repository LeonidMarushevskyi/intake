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
        :gender,
        :last_name,
        :person_id,
        :screening_id,
        :ssn,
        addresses: [
          :id,
          :street_address,
          :city,
          :state,
          :zip,
          :type
        ]
      ].freeze

      def create
        participant = Participant.new(participant_params.to_h)
        created_participant = ParticipantRepository.create(participant)
        render json: created_participant
      end

      def update
        existing_participant = Participant.new(participant_params.to_h)
        updated_participant = ParticipantRepository.update(existing_participant)
        render json: updated_participant
      end

      def show
        participant = ParticipantRepository.find(params[:id])
        render json: participant
      end

      def destroy
        ParticipantRepository.delete(params[:id])
      end

      def participant_params
        params.require(:participant).permit(*PERMITTED_PARAMS)
      end
    end
  end
end
