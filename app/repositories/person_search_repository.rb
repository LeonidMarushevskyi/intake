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
      build_response(search_body)
    end

    private

    def query(search_term:, search_after:)
      PersonSearchQueryBuilder.new(
        search_term: search_term, search_after: search_after
      ).build
    end

    def build_response(search_body)
      {
        'hits' => {
          'total' => search_body.dig('hits', 'total'),
          'hits' => search_hits(search_body)
        }
      }
    end

    # rubocop:disable MethodLength
    def search_hits(search_body)
      search_body.dig('hits', 'hits').map do |document|
        PeopleSearchResultsInterpreter.interpret_sensitivity_indicator(document)
        PeopleSearchResultsInterpreter.interpret_addresses(document)
        PeopleSearchResultsInterpreter.interpret_highlights(document)
        PeopleSearchResultsInterpreter.interpret_race_ethnicity(document)
        PeopleSearchResultsInterpreter.interpret_ssn(document)
        PeopleSearchResultsInterpreter.interpret_legacy_id(document)
        PeopleSearchResultsInterpreter.interpret_sort(document)
        document['_source']
      end
    end
    # rubocop:enable MethodLength
  end
end
