import {createSelector} from 'reselect'
import {
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
