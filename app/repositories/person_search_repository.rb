# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  PEOPLE_SEARCH_PATH = '/api/v1/people_search'
  CONTENT_TYPE = 'application/json'

  def self.search(search_term)
    response = make_api_call("#{PEOPLE_SEARCH_PATH}?search_term=#{search_term}", :get)
    raise 'Error searching people' if response.status != 200
    response.body.map do |result_attributes|
      Person.new(result_attributes)
    end
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
