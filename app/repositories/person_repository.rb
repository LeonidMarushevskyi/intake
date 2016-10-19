# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  PEOPLE_PATH = '/api/v1/people'
  CONTENT_TYPE = 'application/json'

  def self.create(person)
    response = make_api_call(PEOPLE_PATH, :post, person)
    raise 'Error creating person' if response.status != 201
    Rails.logger.info response.body.inspect
    Person.new(response.body)
  end

  def self.find(id)
    response = make_api_call("#{PEOPLE_PATH}/#{id}", :get)
    raise 'Error finding person' if response.status != 200
    Rails.logger.info response.body.inspect
    Person.new(response.body)
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
