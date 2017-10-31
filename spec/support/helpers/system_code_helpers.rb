# frozen_string_literal: true

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

  def stub_system_codes
    system_codes = [
      *allegation_type_codes,
      *contact_purpose_codes,
      *contact_status_codes,
      *communication_method_codes,
      *contact_location_codes,
      *county_type_codes
    ]
    stub_request(:get, /#{ExternalRoutes.ferb_api_lov_path}/).and_return(
      json_body(system_codes, status: 200)
    )
  end
end

RSpec.configure do |config|
  config.include SystemCodeHelpers, type: :feature
end
