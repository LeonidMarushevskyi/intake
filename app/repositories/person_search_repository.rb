# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  def self.search(security_token, search_term)
    response = API.make_api_call(
      security_token,
      Rails.application.routes.url_helpers.intake_api_people_search_path(search_term: search_term),
      :get
    )
    response.body.map do |result_attributes|
      PersonSearch.new(result_attributes)
    end
  end
end
