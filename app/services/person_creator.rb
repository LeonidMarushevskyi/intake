# frozen_string_literal: true

# PersonCreator is a service class responsible for creation of a person
# resource via the API
class PersonCreator
  PEOPLE_PATH = '/api/v1/people'
  CONTENT_TYPE = 'application/json'
  PERSON_ATTRS = %i(first_name last_name gender date_of_birth ssn).freeze
  ADDRESS_ATTRS = %i(street_address city state zip).freeze

  def self.create(user_passed_in_attributes = {})
    params = compose_person_params(user_passed_in_attributes)
    response = make_api_request_with_params(params)
    raise 'Error creating person' if response.status != 201
    Rails.logger.info response.body.inspect
    response.body.with_indifferent_access
  end

  def self.compose_person_params(user_passed_in_params)
    params = {}
    PERSON_ATTRS.map do |attr|
      params[attr] = user_passed_in_params[attr]
    end
    params[:address] = compose_address_params(user_passed_in_params)
    params
  end
  private_class_method :compose_person_params

  def self.compose_address_params(user_passed_in_params)
    ADDRESS_ATTRS.each_with_object({}) do |attr, address_params|
      address_params[attr] = user_passed_in_params[attr]
    end
  end
  private_class_method :compose_address_params

  def self.make_api_request_with_params(person_params)
    ::API.connection.post do |req|
      req.url PEOPLE_PATH
      req.headers['Content-Type'] = CONTENT_TYPE
      req.body = person_params.to_json
    end
  end
  private_class_method :make_api_request_with_params
end
