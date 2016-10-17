# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  PEOPLE_PATH = '/api/v1/people'
  CONTENT_TYPE = 'application/json'

  def self.create(person)
    response = make_api_post(PEOPLE_PATH, person)
    raise 'Error creating person' if response.status != 201
    Rails.logger.info response.body.inspect
    Person.new(response.body)
  end

  def self.find(id)
    response = make_api_get("#{PEOPLE_PATH}/#{id}")
    raise 'Error finding person' if response.status != 200
    Rails.logger.info response.body.inspect
    response.body.with_indifferent_access
  end

  def self.make_api_post(url, attributes = {})
    ::API.connection.post do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE
      req.body = attributes.to_json
    end
  end
  private_class_method :make_api_post

  def self.make_api_get(url)
    ::API.connection.get do |req|
      req.url url
      req.headers['Content-Type'] = CONTENT_TYPE
    end
  end
  private_class_method :make_api_get
end
