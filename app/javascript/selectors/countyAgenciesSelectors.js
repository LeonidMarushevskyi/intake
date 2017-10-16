import {createSelector} from 'reselect'
import {List} from 'immutable'
import {
  AGENCY_TYPES,
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COMMUNITY_CARE_LICENSING,
  COUNTY_LICENSING,
} from 'enums/CrossReport'

export const getCountyAgencies = (state) => state.get('countyAgencies')
export const getDistrictAttorneyAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DISTRICT_ATTORNEY)
)
export const getDepartmentOfJusticeAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DEPARTMENT_OF_JUSTICE)
)
export const getLawEnforcementAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === LAW_ENFORCEMENT)
)
export const getCountyLicensingAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COUNTY_LICENSING)
)
export const getCommunityCareLicensingAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COMMUNITY_CARE_LICENSING)
)

export const getAgencyCodeToName = createSelector(
  (state) => state.getIn(['screening', 'cross_reports', 0, 'agencies']) || List(),
  getCountyAgencies,
  (agencies, countyAgencies) => agencies.reduce((agencyCodeToName, agency) => {
    const agencyTypeName = AGENCY_TYPES[agency.get('type')]
    const agencyCode = agency.get('id')
    if (agencyCode) {
      const agencyData = countyAgencies.find((countyAgency) => countyAgency.get('id') === agencyCode)
      if (agencyData && agencyData.get('name')) {
        agencyCodeToName[agencyCode] = `${agencyTypeName} - ${agencyData.get('name')}`
      } else {
        agencyCodeToName[agencyCode] = `${agencyTypeName} - ${agencyCode}`
      }
    }
    return agencyCodeToName
  }, {})
)
