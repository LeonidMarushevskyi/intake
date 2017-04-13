# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  PARTICIPANTS_PATH = '/api/v1/participants'

  def self.create(security_token, participant)
    participant_data = participant_json_without_root_id(participant)
    response = API.make_api_call(security_token, PARTICIPANTS_PATH, :post, participant_data)
    Participant.new(response.body)
  end

  def self.delete(security_token, id)
    API.make_api_call(security_token, "#{PARTICIPANTS_PATH}/#{id}", :delete)
  end

  def self.update(security_token, participant)
    raise 'Error updating participant: id is required' unless participant.id
    response = API.make_api_call(
      security_token,
      "#{PARTICIPANTS_PATH}/#{participant.id}",
      :put,
      participant_json_without_root_id(participant)
    )
    Participant.new(response.body)
  end

  def self.participant_json_without_root_id(participant)
    participant.as_json.except('id')
  end
end
