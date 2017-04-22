export const ROLE_TYPE_REPORTER = Object.freeze([
  'Mandated Reporter',
  'Non-mandated Reporter',
  'Anonymous Reporter',
])

export const ROLE_TYPE = Object.freeze([
  'Victim',
  'Perpetrator',
  ...ROLE_TYPE_REPORTER,
])
