/*eslint quote-props: ["error", "consistent-as-needed"]*/
const RACES = Object.freeze({
  'White': {
    exclusive: false,
  },
  'Black or African American': {
    exclusive: false,
  },
  'Asian': {
    exclusive: false,
  },
  'American Indian or Alaska Native': {
    exclusive: false,
  },
  'Native Hawaiian or Other Pacific Islander': {
    exclusive: false,
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
