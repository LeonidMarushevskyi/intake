# frozen_string_literal: true

module CountyAgenciesHelpers
  def stub_county_agencies(county_id = 1234)
    county_agencies = [
      {
        'id' => 'LsUFj7O00E',
        'name' => "Daisie's Preschool",
        'type' => 'COMMUNITY_CARE_LICENSING',
        'county_id' => county_id
      },
      {
        'id' => 'EYIS9Nh75C',
        'name' => 'DOJ Agency',
        'type' => 'DEPARTMENT_OF_JUSTICE',
        'county_id' => county_id
      },
      {
        'id' => '45Hvp7x00F',
        'name' => 'LA District Attorney',
        'type' => 'DISTRICT_ATTORNEY',
        'county_id' => county_id
      },
      {
        'id' => '65Hvp7x01F',
        'name' => 'LA District Attorney - Criminal Division',
        'type' => 'DISTRICT_ATTORNEY',
        'county_id' => county_id
      },
      {
        'id' => 'GPumYGQ00F',
        'name' => 'Hovernment Agency',
        'type' => 'COUNTY_LICENSING',
        'county_id' => county_id
      },
      {
        'id' => 'BMG2f3J75C',
        'name' => 'The Sheriff',
        'type' => 'LAW_ENFORCEMENT',
        'county_id' => county_id
      }
    ]
    stub_request(
      :get,
      /#{ExternalRoutes.ferb_api_cross_report_agency}\?countyId=#{county_id}/
    ).and_return(
      json_body(county_agencies, status: 200)
    )
  end
end

RSpec.configure do |config|
  config.include CountyAgenciesHelpers, type: :feature
end
