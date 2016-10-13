# frozen_string_literal: true

# PersonService is a service class responsible for creation of a person
# resource via the API
class PersonService
  PEOPLE_PATH = '/api/v1/people'
  CONTENT_TYPE = 'application/json'
  PERSON_ATTRS = %i(first_name last_name gender date_of_birth ssn address).freeze

  def self.create(user_passed_in_attributes = {})
    params = compose_person_params(user_passed_in_attributes)
    response = make_api_post(PEOPLE_PATH, params)
    raise 'Error creating person' if response.status != 201
    Rails.logger.info response.body.inspect
    response.body.with_indifferent_access
  end

  def self.find(id)
    response = make_api_get("#{PEOPLE_PATH}/#{id}")
    raise 'Error finding person' if response.status != 200
    Rails.logger.info response.body.inspect
    response.body.with_indifferent_access
  end

  def self.compose_person_params(user_passed_in_params)
    params = {}
    PERSON_ATTRS.map do |attr|
      params[attr] = user_passed_in_params[attr]
    end
    params
  end
  private_class_method :compose_person_params

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
