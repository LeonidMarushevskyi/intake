export const COMMUNITY_CARE_LICENSING = 'COMMUNITY_CARE_LICENSING'
export const COUNTY_LICENSING = 'COUNTY_LICENSING'
export const DEPARTMENT_OF_JUSTICE = 'DEPARTMENT_OF_JUSTICE'
export const DISTRICT_ATTORNEY = 'DISTRICT_ATTORNEY'
export const LAW_ENFORCEMENT = 'LAW_ENFORCEMENT'

export const AGENCY_TYPES = Object.freeze({
  [DISTRICT_ATTORNEY]: 'District attorney',
  [LAW_ENFORCEMENT]: 'Law enforcement',
  [DEPARTMENT_OF_JUSTICE]: 'Department of justice',
  [COUNTY_LICENSING]: 'County licensing',
  [COMMUNITY_CARE_LICENSING]: 'Community care licensing',
})

export const COMMUNICATION_METHODS = Object.freeze([
  'Child Abuse Form',
  'Electronic Report',
  'Suspected Child Abuse Report',
  'Telephone Report',
])

export const ALLEGATIONS_REQUIRE_CROSS_REPORTS_MESSAGE = 'Any report that includes allegations (except General Neglect, Caretaker Absence, or "At risk, sibling abused") must be cross-reported to law enforcement and the district attorney.'

export const CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS = Object.freeze([
  DISTRICT_ATTORNEY,
  LAW_ENFORCEMENT,
])
