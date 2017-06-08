# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  def self.create(security_token, participant)
    participant_data = participant.as_json(except: :id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_participants_path,
      :post,
      participant_data
    )
    Participant.new(response.body)
  end

  def self.delete(security_token, id)
    IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_participant_path(id),
      :delete
    )
  end

  def self.update(security_token, participant)
    raise 'Error updating participant: id is required' unless participant.id
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_participant_path(participant.id),
      :put,
      participant_json_without_root_id(participant)
    )
    Participant.new(response.body)
  end

  def self.participant_json_without_root_id(participant)
    participant.as_json.except('id')
  end
end
