# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  PEOPLE_PATH = '/api/v1/people'
  PEOPLE_SEARCH_PATH = '/api/v1/people_search'

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

  def self.search(search_term)
    response = API.make_api_call("#{PEOPLE_SEARCH_PATH}?search_term=#{search_term}", :get)
    response.body.map do |result_attributes|
      Person.new(result_attributes)
    end
  end
end
