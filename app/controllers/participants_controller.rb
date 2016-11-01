# frozen_string_literal: true

# Participants Controller handles all service request for
# the creation and modification of screening participant objects.
class ParticipantsController < ApplicationController # :nodoc:
  def create
    respond_to do |format|
      format.json do
        participant = Participant.new(participant_params.to_h)
        created_participant = ParticipantRepository.create(participant)
        render json: created_participant
      end
    end
  end

  def participant_params
    params.require(:participant).permit(
      :date_of_birth,
      :first_name,
      :gender,
      :last_name,
      :person_id,
      :screening_id,
      :ssn
    )
  end
end
