# frozen_string_literal: true

# The connection object will be used to talk to the Intake API
class DoraAPI < JsonAPI
  class << self
    def api_url
      Rails.application.config.intake[:dora_api_url]
    end

    def interpret_response(response)
      parse_response(response).map do |document|
        PeopleSearchResultsInterpreter.interpret_sensitivity_indicator(document)
        PeopleSearchResultsInterpreter.interpret_addresses(document)
        PeopleSearchResultsInterpreter.interpret_languages(document)
        PeopleSearchResultsInterpreter.interpret_highlights(document)
        PeopleSearchResultsInterpreter.interpret_race_ethnicity(document)
        PeopleSearchResultsInterpreter.interpret_ssn(document)
        document['_source']
      end
    end

    def parse_response(response)
      return response.body.dig('hits', 'hits') if response.status == 200
      raise response.body
    end
  end
end
