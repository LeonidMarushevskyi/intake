import {createSelector} from 'reselect'
import {
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COMMUNITY_CARE_LICENSING,
  COUNTY_LICENSING,
} from 'enums/CrossReport'

export const getCountyAgenciesSelector = (state) => state.get('countyAgencies')
export const getDistrictAttorneyAgenciesSelector = createSelector(
  getCountyAgenciesSelector,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DISTRICT_ATTORNEY)
)
export const getDepartmentOfJusticeAgenciesSelector = createSelector(
  getCountyAgenciesSelector,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === DEPARTMENT_OF_JUSTICE)
)
export const getLawEnforcementAgenciesSelector = createSelector(
  getCountyAgenciesSelector,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === LAW_ENFORCEMENT)
)
export const getCountyLicensingAgenciesSelector = createSelector(
  getCountyAgenciesSelector,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COUNTY_LICENSING)
)
export const getCommunityCareLicensingAgenciesSelector = createSelector(
  getCountyAgenciesSelector,
  (countyAgencies) => countyAgencies.filter((countyAgency) => countyAgency.get('type') === COMMUNITY_CARE_LICENSING)
)
