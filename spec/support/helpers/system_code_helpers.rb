# frozen_string_literal: true

module SystemCodeHelpers
  def stub_system_codes
    system_codes = [
      { code: 'A', value: 'Attempted', category: 'contact_status', sub_category: nil },
      { code: '1', value: 'Investigate Referral', category: 'contact_purpose', sub_category: nil },
      { code: 'ABC', value: 'In person', category: 'communication_method', sub_category: nil },
      { code: 'FAX', value: 'Fax', category: 'communication_method', sub_category: nil },
      { code: '123', value: 'School', category: 'contact_location', sub_category: nil },
      { code: 'OFFICE', value: 'CWS Office', category: 'contact_location', sub_category: nil },
      { code: 'c40', value: 'San Francisco', category: 'county_type', sub_category: nil },
      { code: 'c41', value: 'State of California', category: 'county_type', sub_category: nil },
      { code: 'c42', value: 'Sacramento', category: 'county_type', sub_category: nil }
    ]
    stub_request(:get, ferb_api_url(ExternalRoutes.ferb_api_lov_path)).and_return(
      json_body(system_codes, status: 200)
    )
  end
end

RSpec.configure do |config|
  config.include SystemCodeHelpers, type: :feature
end
