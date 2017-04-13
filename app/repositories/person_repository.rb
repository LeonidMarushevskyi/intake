# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  PEOPLE_PATH = '/api/v1/people'

  def self.create(security_token, person)
    response = API.make_api_call(security_token, PEOPLE_PATH, :post, person.as_json(except: :id))
    Person.new(response.body)
  end

  def self.find(security_token, id)
    response = API.make_api_call(security_token, "#{PEOPLE_PATH}/#{id}", :get)
    Person.new(response.body)
  end

  def self.update(security_token, person)
    raise 'Error updating person: id is required' unless person.id
    response = API.make_api_call(
      security_token,
      "#{PEOPLE_PATH}/#{person.id}",
      :put,
      person.as_json(except: :id)
    )
    Person.new(response.body)
  end
end
