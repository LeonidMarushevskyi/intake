# frozen_string_literal: true

# RaceMapping is a mapping class which maps races
class RaceMapping < MappingBase
  RACE_MAP_TO_LEGACY = {
    'Romanian' => 'White - Romanian*',
    'European' => 'White - European*',
    'Armenian' => 'White - Armenian*',
    'Laotian' => 'Laotian*',
    'Middle Eastern' => 'White - Middle Eastern*',
    'Filipino' => 'Filipino*',
    'Ethiopian' => 'Ethiopian*',
    'White' => 'White*',
    'Guamanian' => 'Guamanian*',
    'Japanese' => 'Japanese*',
    'Alaska Native' => 'Alaskan Native*',
    'Korean' => 'Korean*',
    'Hmong' => 'Hmong*',
    'Asian Indian' => 'Asian Indian*',
    'Black or African American' => 'Black*',
    'Black' => 'Black*',
    'Hawaiian' => 'Hawaiian*',
    'Native Hawaiian or Other Pacific Islander' => 'Other Pacific Islander*',
    'Chinese' => 'Chinese*',
    'Vietnamese' => 'Vietnamese*',
    'Cambodian' => 'Cambodian*',
    'Samoan' => 'Samoan*',
    'Caribbean' => 'Caribbean',
    'Central American' => 'White - Central American*',
    'Asian' => 'Other Asian*',
    'Other Asian' => 'Other Asian*',
    'American Indian' => 'American Indian*',
    'American Indian or Alaska Native' => 'American Indian*',
    'Polynesian' => 'Polynesian*',
    'Other Pacific Islander' => 'Other Pacific Islander*',
    'Other Asian/Pacific Islander' => 'Other Pacific Islander*',
    'Unknown' => 'Other Race Unknown*',
    'Declined to answer' => 'Declines to State*',
    'Abandoned' => 'Unable to Determine*'
  }.freeze

  RACE_MAP_FROM_LEGACY = {
    'Alaskan Native*' => {
      'race' => 'American Indian or Alaska Native',
      'race_detail' => 'Alaska Native'
    },
    'American Indian*' => {
      'race' => 'American Indian or Alaska Native',
      'race_detail' => 'American Indian'
    },
    'Asian Indian*' => { 'race' => 'Asian', 'race_detail' => 'Asian Indian' },
    'Black*' => { 'race' => 'Black or African American', 'race_detail' => 'Black' },
    'Cambodian*' => { 'race' => 'Asian', 'race_detail' => 'Cambodian' },
    'Caribbean' => { 'race' => 'Black or African American', 'race_detail' => 'Caribbean' },
    'Chinese*' => { 'race' => 'Asian',  'race_detail' => 'Chinese' },
    'Declines to State*' => { 'race' => 'Declined to answer' },
    'Ethiopian*' => { 'race' => 'Black or African American', 'race_detail' => 'Ethiopian' },
    'Filipino*' => { 'race' => 'Asian', 'race_detail' => 'Filipino' },
    'Guamanian*' => {
      'race' => 'Native Hawaiian or Other Pacific Islander',
      'race_detail' => 'Guamanian'
    },
    'Hawaiian*' => {
      'race' => 'Native Hawaiian or Other Pacific Islander',
      'race_detail' => 'Hawaiian'
    },
    'Hmong*' => { 'race' => 'Asian', 'race_detail' => 'Hmong' },
    'Japanese*' => { 'race' => 'Asian', 'race_detail' => 'Japanese' },
    'Korean*' => { 'race' => 'Asian', 'race_detail' => 'Korean' },
    'Laotian*' => { 'race' => 'Asian',  'race_detail' => 'Laotian' },
    'Other Asian*' => { 'race' => 'Asian', 'race_detail' => 'Other Asian' },
    'Other Pacific Islander*' => {
      'race' => 'Native Hawaiian or Other Pacific Islander',
      'race_detail' => 'Other Pacific Islander'
    },
    'Other Race Unknown*' => { 'race' => 'Unknown' },
    'Polynesian*' => {
      'race' => 'Native Hawaiian or Other Pacific Islander',
      'race_detail' => 'Polynesian'
    },
    'Samoan*' => {
      'race' => 'Native Hawaiian or Other Pacific Islander',
      'race_detail' => 'Samoan'
    },
    'Unable to Determine*' => { 'race' => 'Abandoned' },
    'Vietnamese*' => { 'race' => 'Asian', 'race_detail' => 'Vietnamese' },
    'White - Armenian*' => { 'race' => 'White', 'race_detail' => 'Armenian' },
    'White - Central American*' => { 'race' => 'White', 'race_detail' => 'Central American' },
    'White - European*' => { 'race' => 'White', 'race_detail' => 'European' },
    'White - Middle Eastern*' => { 'race' => 'White', 'race_detail' => 'Middle Eastern' },
    'White - Romanian*' => { 'race' => 'White', 'race_detail' => 'Romanian' },
    'White*' => { 'race' => 'White' }
  }.freeze

  legacy_category_id('ETHNCTYC')
  legacy_description_mapping(RACE_MAP_TO_LEGACY)
end
