import {createSelector} from 'reselect'
import {List} from 'immutable'

export const COMMUNITY_CARE_LICENSING = 'COMMUNITY_CARE_LICENSING'
export const COUNTY_LICENSING = 'COUNTY_LICENSING'
export const DEPARTMENT_OF_JUSTICE = 'DEPARTMENT_OF_JUSTICE'
export const DISTRICT_ATTORNEY = 'DISTRICT_ATTORNEY'
export const LAW_ENFORCEMENT = 'LAW_ENFORCEMENT'
export const LICENSING = 'LICENSING'

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
export const getLicensingAgencies = createSelector(
  getCountyAgencies,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COMMUNITY_CARE_LICENSING || countyAgency.get('type') === COUNTY_LICENSING)
)

export const getAgencyCodeToName = createSelector(
  (state) => state.getIn(['screening', 'cross_reports']) || List(),
  getCountyAgencies,
  (crossReports, countyAgencies) => crossReports.reduce((agencyCodeToName, crossReport) => {
    const agencyType = crossReport.get('agency_type')
    const agencyCode = crossReport.get('agency_code')
    if (agencyCode) {
      const agency = countyAgencies.find((countyAgency) => countyAgency.get('id') === agencyCode)
      if (agency && agency.get('name')) {
        agencyCodeToName[agencyCode] = `${agencyType} - ${agency.get('name')}`
      } else {
        agencyCodeToName[agencyCode] = `${agencyType} - ${agencyCode}`
      }
    }
    return agencyCodeToName
  }, {})
)
