# frozen_string_literal: true

# RelationshipsRepository is a service class responsible for retrieval of
# relationships via the API
class RelationshipsRepository
  def self.find_by_screening_id(security_token, screening_id)
    intake_api_relationships_by_screening_url =
      Rails.application.routes.url_helpers
           .intake_api_relationships_by_screening_path(id: screening_id)
    response = API.make_api_call(security_token, intake_api_relationships_by_screening_url, :get)
    response.body
  end
end
