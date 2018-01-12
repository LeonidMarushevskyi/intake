# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  class << self
    def search(security_token:, search_term:, search_after:)
      response = DoraAPI.make_api_call(
        security_token,
        Rails.application.routes.url_helpers.dora_people_light_index_path,
        :post,
        query(search_term: search_term, search_after: search_after)
      )
      search_body = response.body
      raise search_body unless response.status == 200
      search_body
    end

    private

    def query(search_term:, search_after:)
      PersonSearchQueryBuilder.new(
        search_term: search_term, search_after: search_after
      ).build
    end
  end
end
