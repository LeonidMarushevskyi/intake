import {createSelector} from 'reselect'
import _ from 'lodash'

export const COMMUNITY_CARE_LICENSING = 'COMMUNITY_CARE_LICENSING'
export const COUNTY_LICENSING = 'COUNTY_LICENSING'
export const DEPARTMENT_OF_JUSTICE = 'DEPARTMENT_OF_JUSTICE'
export const DISTRICT_ATTORNEY = 'DISTRICT_ATTORNEY'
export const LAW_ENFORCEMENT = 'LAW_ENFORCEMENT'
export const LICENSING = 'LICENSING'

export const getDistrictAttorneyAgencies = createSelector(
  (state) => state.get('countyAgencies'),
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DISTRICT_ATTORNEY)
)
export const getDepartmentOfJusticeAgencies = createSelector(
  (state) => state.get('countyAgencies'),
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DEPARTMENT_OF_JUSTICE)
)
export const getLawEnforcementAgencies = createSelector(
  (state) => state.get('countyAgencies'),
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === LAW_ENFORCEMENT)
)
export const getLicensingAgencies = createSelector(
  (state) => state.get('countyAgencies'),
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COMMUNITY_CARE_LICENSING || countyAgency.get('type') === COUNTY_LICENSING)
)

// TODO: This should become a real selector like the above in the future say in #150924573
export const agencyTypeAndName = (agency_type, agency_code, countyAgencies) => {
  const typeId = agency_type.replace(/ /gi, '_').toUpperCase()
  const agencies = countyAgencies[typeId]
  if (_.isEmpty(agencies)) {
    return agency_type
  } else {
    const filteredAgencies = agencies.filter((countyAgency) => countyAgency.id === agency_code)
    if (_.isEmpty(filteredAgencies)) {
      return agency_type
    } else {
      const agencyName = filteredAgencies[0].name
      return agencyName ? `${agency_type} - ${agencyName}` : agency_type
    }
  }
}
