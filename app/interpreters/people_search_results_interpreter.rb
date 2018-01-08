# frozen_string_literal: true

class PeopleSearchResultsInterpreter # :nodoc:
  class << self
    ALLOWABLE_SSN_CHARS = 4

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

    def interpret_sort(document)
      document.tap do |doc|
        doc['_source'].merge!(
          'sort' => document['sort']
        )
      end
    end
  end
end
