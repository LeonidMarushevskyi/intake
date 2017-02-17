# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  PARTICIPANTS_PATH = '/api/v1/participants'
  CONTENT_TYPE = 'application/json'

  def self.create(participant)
    response = make_api_call(PARTICIPANTS_PATH, :post, participant.as_json(except: :id))
    raise 'Error creating participant' if response.status != 201
    Rails.logger.info response.body.inspect
    Participant.new(response.body)
  end

  def self.make_api_call(url, method, attributes = nil)
    ::API.connection.send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
      req.body = attributes.to_json unless attributes.nil?
    end
  end
  private_class_method :make_api_call
end
