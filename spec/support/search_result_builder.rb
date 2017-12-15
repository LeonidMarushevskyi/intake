# frozen_string_literal: true

class SearchResultBuilder
  def self.build
    builder = new
    yield(builder)
    builder.search_result
  end

  def initialize
    @search_result = {
      hits: {
        total: 1,
        hits: [{
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
          }
        }]
      }
    }
  end

  def with_first_name(first_name)
    @search_result[:hits][:hits][0][:_source][:first_name] = first_name
  end

  def with_middle_name(middle_name)
    @search_result[:hits][:hits][0][:_source][:middle_name] = middle_name
  end

  def with_last_name(last_name)
    @search_result[:hits][:hits][0][:_source][:last_name] = last_name
  end

  def with_name_suffix(suffix)
    @search_result[:hits][:hits][0][:_source][:name_suffix] = suffix
  end

  def with_gender(gender)
    @search_result[:hits][:hits][0][:_source][:gender] = gender
  end

  def with_dob(dob)
    @search_result[:hits][:hits][0][:_source][:date_of_birth] = dob.to_s(:db)
  end

  def with_ssn(ssn)
    @search_result[:hits][:hits][0][:_source][:ssn] = ssn
  end

  def with_languages(languages)
    @search_result[:hits][:hits][0][:_source][:languages] = languages
  end

  def with_race_and_ethinicity(race_ethnicity)
    @search_result[:hits][:hits][0][:_source][:race_ethnicity] = race_ethnicity
  end

  def with_phone_number(phone_number)
    @search_result[:hits][:hits][0][:_source][:phone_numbers] = [
      phone_number
    ]
  end

  def with_address(address)
    @search_result[:hits][:hits][0][:_source][:addresses] = [
      address
    ]
  end

  def with_legacy_descriptor(legacy_descriptor)
    @search_result[:hits][:hits][0][:_source][:legacy_descriptor] = legacy_descriptor
  end

  def with_sensitivity
    @search_result[:hits][:hits][0][:_source][:sensitivity_indicator] = 'S'
  end

  def with_sealed
    @search_result[:hits][:hits][0][:_source][:sensitivity_indicator] = 'R'
  end

  def without_sealed_or_sensitive
    @search_result[:hits][:hits][0][:_source][:sensitivity_indicator] = 'N'
  end

  attr_reader :search_result
end
