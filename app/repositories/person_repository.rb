# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  PEOPLE_PATH = '/api/v1/people'
  CONTENT_TYPE = 'application/json'

  def self.create(person)
    response = API.make_api_call(PEOPLE_PATH, :post, person.as_json(except: :id))
    Person.new(response.body)
  end

  def self.find(id)
    response = API.make_api_call("#{PEOPLE_PATH}/#{id}", :get)
    Person.new(response.body)
  end

  def self.update(person)
    raise 'Error updating person: id is required' unless person.id
    response = API.make_api_call("#{PEOPLE_PATH}/#{person.id}", :put, person.as_json(except: :id))
    Person.new(response.body)
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
      url: url, method: method
  end
  private_class_method :make_api_call
end
