# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
module Api
  module V1
    class ParticipantsController < ApplicationController # :nodoc:
      respond_to :json

      def create
        participant = Participant.new(participant_params.to_h)
        created_participant = ParticipantRepository.create(participant)
        render json: created_participant
      end

      def addresses_params
        [
          :id,
          :street_address,
          :city,
          :state,
          :zip,
          :type
        ]
      end

      def participant_params
        params.require(:participant).permit(
          :date_of_birth,
          :first_name,
          :gender,
          :last_name,
          :person_id,
          :screening_id,
          :ssn,
          addresses: addresses_params
        )
      end
    end
  end
end
