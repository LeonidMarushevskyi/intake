# frozen_string_literal: true

require 'support/helpers/system_code_helpers'

class PersonSearchResultBuilder
  def self.build
    builder = new
    yield(builder)
    builder.search_result
  end

  def initialize
    @search_result = {
      _source: {
        legacy_source_table: '',
        first_name: '',
        gender: '',
        last_name: '',
        middle_name: '',
        name_suffix: '',
        ssn: '',
        phone_numbers: [],
        languages: [],
        race_ethnicity: {},
        addresses: [],
        date_of_birth: '',
        legacy_descriptor: {},
        sensitivity_indicator: ''
      },
      sort: nil
    }
  end

  def with_first_name(first_name)
    @search_result[:_source][:first_name] = first_name
  end

  def with_middle_name(middle_name)
    @search_result[:_source][:middle_name] = middle_name
  end

  def with_last_name(last_name)
    @search_result[:_source][:last_name] = last_name
  end

  def with_name_suffix(suffix)
    @search_result[:_source][:name_suffix] = suffix
  end

  def with_gender(gender)
    @search_result[:_source][:gender] = gender
  end

  def with_dob(dob)
    @search_result[:_source][:date_of_birth] = dob.to_s(:db)
  end

  def with_ssn(ssn)
    @search_result[:_source][:ssn] = ssn
  end

  def with_languages
    @search_result[:_source][:languages] = yield
  end

  def with_race_and_ethnicity
    @search_result[:_source][:race_ethnicity] = yield
  end

  def with_phone_number(phone_number)
    @search_result[:_source][:phone_numbers] = [
      phone_number
    ]
  end

  def with_addresses
    @search_result[:_source][:addresses] = yield
  end

  def with_legacy_descriptor(legacy_descriptor)
    @search_result[:_source][:legacy_descriptor] = legacy_descriptor
  end

  def with_sensitivity
    @search_result[:_source][:sensitivity_indicator] = 'S'
  end

  def with_sealed
    @search_result[:_source][:sensitivity_indicator] = 'R'
  end

  def without_sealed_or_sensitive
    @search_result[:_source][:sensitivity_indicator] = 'N'
  end

  def with_sort(sort)
    @search_result[:sort] = sort
  end

  attr_reader :search_result
end

class LanguageSearchResultBuilder
  include ::SystemCodeHelpers

  def self.build(language)
    builder = new(language)
    yield(builder) if block_given?
    builder.language
  end

  def initialize(language)
    system_code = find_system_code(value: language, category: 'language')
    @language = {
      id: system_code[:code],
      name: language
    }
  end

  def with_primary(primary)
    @language.merge(primary: primary == true)
  end

  attr_reader :language
end

class RaceEthnicitySearchResultBuilder
  def self.build
    builder = new
    yield(builder)
    builder.race_ethnicity
  end

  def initialize
    @race_ethnicity = {}
  end

  def with_hispanic_origin_code(code)
    @race_ethnicity[:hispanic_origin_code] = code
  end

  def with_unable_to_determine_code(code)
    @race_ethnicity[:unable_to_determine_code] = code
  end

  def with_hispanic_unable_to_determine_code(code)
    @race_ethnicity[:hispanic_unable_to_determine_code] = code
  end

  def with_race_codes
    @race_ethnicity[:race_codes] = yield
  end

  def with_hispanic_codes
    @race_ethnicity[:hispanic_codes] = yield
  end

  attr_reader :race_ethnicity
end

class RaceCodesSearchResultBuilder
  include ::SystemCodeHelpers

  def self.build(race)
    builder = new(race)
    yield(builder) if block_given?
    builder.race_codes_result
  end

  def initialize(race)
    system_code = find_system_code(value: race, category: 'race_type')
    @race_codes_result = {
      id: system_code[:code]
    }
  end

  attr_reader :race_codes_result
end

class HispanicCodesSearchResultBuilder
  include ::SystemCodeHelpers

  def self.build(ethnicity)
    builder = new(ethnicity)
    yield(builder)
    builder.hispanic_codes
  end

  def initialize(ethnicity)
    system_code = find_system_code(value: ethnicity, category: 'ethnicity_type')
    @hispanic_codes = {
      id: system_code[:code]
    }
  end

  attr_reader :hispanic_codes
end

class AddressSearchResultBuilder
  def self.build
    builder = new
    yield(builder)
    builder.address
  end

  def initialize
    @address = {}
  end

  def with_street_number(number)
    address[:street_number] = number
  end

  def with_street_name(name)
    address[:street_name] = name
  end

  def with_state_code(code)
    address[:state_code] = code
  end

  def with_city(city)
    address[:city] = city
  end

  def with_zip(zip)
    address[:zip] = zip
  end

  def with_type
    address[:type] = yield
  end

  attr_reader :address
end

class AddressTypeSearchResultBuilder
  include ::SystemCodeHelpers

  def self.build(type)
    builder = new(type)
    builder.address_type
  end

  def initialize(type)
    system_code = find_system_code(value: type, category: 'address_type')
    @address_type = {
      id: system_code[:code]
    }
  end

  attr_reader :address_type
end
