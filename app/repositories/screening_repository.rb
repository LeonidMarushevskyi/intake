# frozen_string_literal: true

# ScreeningRepository is a service class responsible for creation of a screening
# resource via the API
class ScreeningRepository
  SCREENINGS_PATH = '/api/v1/screenings'
  CONTENT_TYPE = 'application/json'

  def self.create(screening)
    response = make_api_call(SCREENINGS_PATH, :post, screening)
    raise 'Error creating screening' if response.status != 201
    Rails.logger.info response.body.inspect
    Screening.new(response.body)
  end

  def self.find(id)
    response = make_api_call("#{SCREENINGS_PATH}/#{id}", :get)
    raise 'Error finding screening' if response.status != 200
    Rails.logger.info response.body.inspect
    Screening.new(response.body)
  end

  def self.make_api_call(url, method, attributes = nil)
    ::API.connection.send(method) do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE
      req.body = attributes.to_json unless attributes.nil?
    end
  end
  private_class_method :make_api_call
end
