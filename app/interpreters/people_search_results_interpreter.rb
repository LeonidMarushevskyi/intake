# frozen_string_literal: true

class PeopleSearchResultsInterpreter # :nodoc:
  class << self
    ALLOWABLE_SSN_CHARS = 4

    def interpret_sensitivity_indicator(document)
      source = document['_source']
      # sensitivity_indicator { S => Sensitive, R => Sealed, otherwise neither }
      if source && source['sensitivity_indicator']
        source['sensitive'] = source['sensitivity_indicator'].casecmp('s').zero?
        source['sealed'] = source['sensitivity_indicator'].casecmp('r').zero?
      else
        source['sensitive'] = false
        source['sealed'] = false
      end
    end

    def interpret_languages(document)
      source = document['_source']
      return unless source['languages']&.any?
      sorted_languages = source['languages'].partition do |language|
        language['primary'] == true
      end.flatten
      source['languages'] = sorted_languages.map { |language| language['name'] }
    end

    def interpret_addresses(document)
      source = document['_source']
      return unless source['addresses']&.any?
      translated_addresses = source['addresses'].map do |address|
        address['street_address'] = [
          address['street_number'], address['street_name']
        ].join(' ')
        address['state'] = address['state_code']
        address.except('state_code', 'street_number', 'street_name')
      end
      source['addresses'] = translated_addresses
    end

    def interpret_highlights(document)
      highlight = {}
      if document['highlight']
        highlight = document['highlight'].each_with_object({}) do |(k, v), memo|
          memo[k] = v.first
          memo
        end
      end
      document['_source'] = document['_source'].merge('highlight' => highlight)
    end

    def interpret_race_ethnicity(document)
      source = document['_source']
      race_ethnicity = source.stringify_keys['race_ethnicity']
      return unless race_ethnicity
      unable_to_determine_code = race_ethnicity['unable_to_determine_code']
      races = interpret_races(race_ethnicity['race_codes'], unable_to_determine_code)
      ethnicity = interpret_ethnicity(race_ethnicity)
      document['_source'] = source.merge('races' => races).merge('ethnicity' => ethnicity)
    end

    def interpret_ethnicity(race_ethnicity)
      hispanic_latino_origin = race_ethnicity['hispanic_origin_code']
      {
        'hispanic_latino_origin' => hispanic_latino_origin_for_code(hispanic_latino_origin),
        'ethnicity_detail' => interpret_ethnicities(race_ethnicity['hispanic_codes'])
      }
    end

    def interpret_ssn(document)
      source = document['_source']
      ssn = source['ssn']
      return unless source['ssn']&.length == 9
      source['ssn'] = "#{ssn[0..2]}-#{ssn[3..4]}-#{ssn[5..8]}"
    end

    def hispanic_latino_origin_for_code(code)
      {
        'Y' => 'Yes',
        'N' => 'No',
        'U' => 'Unknown',
        'Z' => 'Abandoned',
        'D' => 'Declined to answer'
      }[code]
    end

    def interpret_ethnicities(ethnicities)
      return unless ethnicities
      ethnicities.map { |ethnicity| ethnicity['description'] }
    end

    def interpret_races(races, unable_to_determine_code)
      return unless races
      raw_races = races.map { |race| RaceMapping::RACE_MAP_FROM_LEGACY[race['description']] }
      return raw_races unless %w[A I K].include?(unable_to_determine_code)
      return ['Abandoned'] if unable_to_determine_code == 'A'
      ['Unknown']
    end
  end
end
