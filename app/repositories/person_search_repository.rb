# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  PEOPLE_SEARCH_PATH = '/api/v1/people_search'

  def self.search(search_term)
    response = API.make_api_call("#{PEOPLE_SEARCH_PATH}?search_term=#{search_term}", :get)
    response.body.map do |result_attributes|
      Person.new(result_attributes)
    end
  end
end
