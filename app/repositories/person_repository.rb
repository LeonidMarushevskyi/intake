# frozen_string_literal: true

# PersonRepository is a service class responsible for creation of a person
# resource via the API
class PersonRepository
  def self.create(security_token, person)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_people_path,
      :post,
      person.as_json(except: :id)
    )
    Person.new(response.body)
  end

  def self.find(security_token, id)
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_person_path(id),
      :get
    )
    Person.new(response.body)
  end

  def self.update(security_token, person)
    raise 'Error updating person: id is required' unless person.id
    response = IntakeAPI.make_api_call(
      security_token,
      ExternalRoutes.intake_api_person_path(person.id),
      :put,
      person.as_json(except: :id)
    )
    Person.new(response.body)
  end
end
