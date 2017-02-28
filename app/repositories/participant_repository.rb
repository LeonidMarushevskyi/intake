# frozen_string_literal: true

# ParticipantRepository is a service class responsible for creation of a participant
# resource via the API
class ParticipantRepository
  PARTICIPANTS_PATH = '/api/v1/participants'
  CONTENT_TYPE = 'application/json'

  def self.create(participant)
    participant_data = participant.as_json(except: :id)
    make_api_call(PARTICIPANTS_PATH, :post, participant_data)
    Participant.new(response.body)
  end

  def self.delete(id)
    make_api_call("#{PARTICIPANTS_PATH}/#{id}", :delete)
  end

  def self.make_api_call(url, method, attributes = nil)
    ::API.connection.send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE unless method == :get
      req.body = attributes.to_json unless attributes.nil?
    end
  rescue Faraday::Error => e
    raise ApiError,
      message: e.message,
      sent_attributes: attributes.to_json,
      api_url: url, method: method
  end

  private_class_method :make_api_call
end
