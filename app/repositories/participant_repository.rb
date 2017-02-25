# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  PARTICIPANTS_PATH = '/api/v1/participants'
  CONTENT_TYPE = 'application/json'

  def self.create(participant)
    participant_data = participant.as_json(except: :id)
    response = make_api_call(PARTICIPANTS_PATH, :post, participant_data)

    unless response.status == 201
      raise ApiError, message: 'Error creating participant',
                      response: response,
                      sent_attributes: participant_data,
                      api_url: PARTICIPANTS_PATH,
                      method: :post
    end
    Participant.new(response.body)
  end

  def self.delete(id)
    response = make_api_call("#{PARTICIPANTS_PATH}/#{id}", :delete)
    return if response.status == 204
    raise ApiError,
      message: 'Error deleting participant',
      response: response,
      sent_attributes: { id: id }.as_json,
      api_url: PARTICIPANTS_PATH,
      method: :post
  end

  def self.make_api_call(url, method, attributes = nil)
    ::API.connection.send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
      req.body = attributes.to_json unless attributes.nil?
    end
  rescue StandardError => e
    raise ApiError,
      message: e.message, response: e.response,
      sent_attributes: attributes.to_json,
      api_url: url, method: method
  end

  private_class_method :make_api_call
end
