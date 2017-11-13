/*eslint quote-props: ["error", "consistent-as-needed"]*/
export const RACE_DETAILS = {
  'White': [
    'Armenian',
    'Central American',
    'European',
    'Middle Eastern',
    'Romanian',
  ],
  'Black or African American': [
    'Black',
    'Ethiopian',
    'Caribbean',
  ],
  'Asian': [
    'Asian Indian',
    'Cambodian',
    'Chinese',
    'Filipino',
    'Hmong',
    'Japanese',
    'Korean',
    'Laotian',
    'Other Asian',
    'Vietnamese',
  ],
  'American Indian or Alaska Native': [
    'American Indian',
    'Alaska Native',
  ],
  'Native Hawaiian or Other Pacific Islander': [
    'Guamanian',
    'Hawaiian',
    'Other Asian/Pacific Islander',
    'Other Pacific Islander',
    'Polynesian',
    'Samoan',
  ],
  'Unknown': [],
  'Abandoned': [],
  'Declined to answer': [],
}
const RACES = Object.freeze({
  'White': {
    exclusive: false,
    raceDetails: [
      'Armenian',
      'Central American',
      'European',
      'Middle Eastern',
      'Romanian',
    ],
  },
  'Black or African American': {
    exclusive: false,
    raceDetails: [
      'Black',
      'Ethiopian',
      'Caribbean',
    ],
  },
  'Asian': {
    exclusive: false,
    raceDetails: [
      'Asian Indian',
      'Cambodian',
      'Chinese',
      'Filipino',
      'Hmong',
      'Japanese',
      'Korean',
      'Laotian',
      'Other Asian',
      'Vietnamese',
    ],
  },
  'American Indian or Alaska Native': {
    exclusive: false,
    raceDetails: [
      'American Indian',
      'Alaska Native',
    ],
  },
  'Native Hawaiian or Other Pacific Islander': {
    exclusive: false,
    raceDetails: [
      'Guamanian',
      'Hawaiian',
      'Other Asian/Pacific Islander',
      'Other Pacific Islander',
      'Polynesian',
      'Samoan',
    ],
  },
  'Unknown': {
    exclusive: true,
  },
  'Abandoned': {
    exclusive: true,
  },
  'Declined to answer': {
    exclusive: true,
  },
})

export default RACES
