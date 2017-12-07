# frozen_string_literal: true

# PersonSearchRepository is a service class responsible for search of a person
# resource via the API
class PersonSearchRepository
  attr_reader :search_term

  def initialize(search_term = '')
    @search_term = search_term.downcase.delete('/')
  end

  class << self
    def search(security_token, search_term)
      repository = PersonSearchRepository.new(search_term)
      response = DoraAPI.make_api_call(
        security_token,
        Rails.application.routes.url_helpers.dora_people_path,
        :post,
        repository.query
      )
      search_body = response.body
      raise search_body unless response.status == 200
      build_response(search_body)
    end

    def build_response(search_body)
      {
        'hits' => {
          'total' => search_body.dig('hits', 'total'),
          'hits' => search_hits(search_body)
        }
      }
    end

    def search_hits(search_body)
      search_body.dig('hits', 'hits').map do |document|
        PeopleSearchResultsInterpreter.interpret_sensitivity_indicator(document)
        PeopleSearchResultsInterpreter.interpret_addresses(document)
        PeopleSearchResultsInterpreter.interpret_languages(document)
        PeopleSearchResultsInterpreter.interpret_highlights(document)
        PeopleSearchResultsInterpreter.interpret_race_ethnicity(document)
        PeopleSearchResultsInterpreter.interpret_ssn(document)
        PeopleSearchResultsInterpreter.interpret_legacy_id(document)
        document['_source']
      end
    end
  end

  def query
    {
      query: {
        bool: {
          must: must
        }
      },
      _source: fields,
      highlight: highlight
    }
  end

  private

  def must
    return [base_query] unless Rails.configuration.intake[:client_only_search]
    [base_query, client_only]
  end

  def base_query
    {
      multi_match: {
        query: search_term,
        type: 'cross_fields',
        operator: 'and',
        fields: %w[searchable_name searchable_date_of_birth ssn]
      }
    }
  end

  def client_only
    {
      match: {
        'legacy_descriptor.legacy_table_name': 'CLIENT_T'
      }
    }
  end

  def fields
    %w[id legacy_source_table first_name middle_name last_name name_suffix gender
       date_of_birth ssn languages races ethnicity
       addresses.id addresses.street_name addresses.street_number
       addresses.city addresses.state_code addresses.zip addresses.type
       phone_numbers.id phone_numbers.number phone_numbers.type
       highlight legacy_descriptor sensitivity_indicator race_ethnicity]
  end

  def highlight
    {
      order: 'score',
      number_of_fragments: 3,
      require_field_match: false,
      fields: {
        '*': {}
      }
    }
  end
end
