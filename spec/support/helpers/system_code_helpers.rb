# frozen_string_literal: true

# rubocop:disable ModuleLength
module SystemCodeHelpers
  def allegation_type_codes
    [{
      code: 'ALLEGATION_TYPE_1',
      value: 'Allegation Type 1',
      category: 'allegation_type',
      subcategory: nil
    }, {
      code: 'ALLEGATION_TYPE_2',
      value: 'Allegation Type 2',
      category: 'allegation_type',
      subcategory: nil
    }]
  end

  def contact_purpose_codes
    [{
      code: 'CONTACT_PURPOSE_1',
      value: 'Contact purpose 1',
      category: 'contact_purpose',
      sub_category: nil
    }, {
      code: 'CONTACT_PURPOSE_2',
      value: 'Contact purpose 2',
      category: 'contact_purpose',
      sub_category: nil
    }]
  end

  def contact_status_codes
    [{
      code: 'CONTACT_STATUS_1',
      value: 'Contact status 1',
      category: 'contact_status',
      sub_category: nil
    }, {
      code: 'CONTACT_STATUS_2',
      value: 'Contact status 2',
      category: 'contact_status',
      sub_category: nil
    }]
  end

  def communication_method_codes
    [{
      code: 'COMMUNICATION_METHOD_1',
      value: 'In person',
      category: 'communication_method',
      sub_category: nil
    }, {
      code: 'COMMUNICATION_METHOD_2',
      value: 'Communication method 2',
      category: 'communication_method',
      sub_category: nil
    }]
  end

  def contact_location_codes
    [
      { code: '123', value: 'School', category: 'contact_location', sub_category: nil },
      { code: 'OFFICE', value: 'CWS Office', category: 'contact_location', sub_category: nil }
    ]
  end

  def county_type_codes
    [
      { code: 'c40', value: 'San Francisco', category: 'county_type', sub_category: nil },
      { code: 'c41', value: 'State of California', category: 'county_type', sub_category: nil },
      { code: 'c42', value: 'Sacramento', category: 'county_type', sub_category: nil }
    ]
  end

  def address_counties
    [
      { code: '06', value: 'Colusa', category: 'address_county', sub_category: nil },
      { code: '23', value: 'Mendocino', category: 'address_county', sub_category: nil },
      { code: '34', value: 'Sacramento', category: 'address_county', sub_category: nil },
      { code: '99', value: 'State of California', category: 'address_county', sub_category: nil }
    ]
  end

  def response_time_codes
    [
      { code: '1520', value: 'Immediate', category: 'screen_response_time', sub_category: nil }
    ]
  end

  def us_state_codes
    [
      { code: '1', value: 'California', category: 'us_state' },
      { code: '2', value: 'New York', category: 'us_state' }
    ]
  end

  def race_codes
    [
      { code: '1', value: 'White', category: 'race_type' },
      { code: '2', value: 'American Indian or Alaska Native', category: 'race_type' }
    ]
  end

  def ethnicity_codes
    []
  end

  def language_codes
    [
      { code: '1', value: 'French', category: 'language' },
      { code: '2', value: 'Italian', category: 'language' },
      { code: '3', value: 'English', category: 'language' }
    ]
  end

  def hispanic_origin_codes
    [
      { code: 'Y', value: 'Yes', category: 'hispanic_origin_code' }
    ]
  end

  def unable_to_determine_codes
    [
      { code: 'A', value: 'Abandoned', category: 'unable_to_determine_code' },
      { code: 'I', value: 'Unknown', category: 'unable_to_determine_code' },
      { code: 'K', value: 'Unknown', category: 'unable_to_determine_code' }
    ]
  end

  def address_types
    [
        {code: '6273', value: 'Common', category: 'address_type'},
        {code: '28', value: 'Day Care', category: 'address_type'},
        {code: '32', value: 'Home', category: 'address_type'},
        {code: '29', value: 'Homeless', category: 'address_type'},
        {code: '6272', value: 'Other', category: 'address_type'},
        {code: '30', value: 'Penal Institution', category: 'address_type'},
        {code: '31', value: 'Permanent Mailing Address', category: 'address_type'},
        {code: '6271', value: 'Residence 2', category: 'address_type'},
        {code: '27', value: 'Work', category: 'address_type'}
    ]
  end

  def system_codes
    [
      *allegation_type_codes,
      *contact_purpose_codes,
      *contact_status_codes,
      *communication_method_codes,
      *contact_location_codes,
      *county_type_codes,
      *address_counties,
      *response_time_codes,
      *race_codes,
      *ethnicity_codes,
      *language_codes,
      *hispanic_origin_codes,
      *us_state_codes,
      *unable_to_determine_codes,
      *address_types
    ]
  end

  def find_system_code(value:, category:)
    system_code = system_codes.find do |code|
      code[:category] == category && code[:value] == value
    end
    error_message = "cannot find system code for value: '#{value}', category: '#{category}'"
    raise error_message unless system_code
    system_code
  end

  def stub_system_codes
    stub_request(:get, /#{ExternalRoutes.ferb_api_lov_path}/).and_return(
      json_body(system_codes, status: 200)
    )
  end
end
# rubocop:enable ModuleLength

RSpec.configure do |config|
  config.include SystemCodeHelpers, type: :feature
end
