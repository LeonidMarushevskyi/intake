import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_COUNTY_AGENCIES_SUCCESS} from 'actions/countyAgenciesActions'
const COMMUNITY_CARE_LICENSING = 'COMMUNITY_CARE_LICENSING'
const COUNTY_LICENSING = 'COUNTY_LICENSING'
const DEPARTMENT_OF_JUSTICE = 'DEPARTMENT_OF_JUSTICE'
const DISTRICT_ATTORNEY = 'DISTRICT_ATTORNEY'
const LAW_ENFORCEMENT = 'LAW_ENFORCEMENT'
const LICENSING = 'LICENSING'

const findDistrictAttorneyAgencies = (countyAgencies = []) => (
  countyAgencies.filter(({type}) => type === DISTRICT_ATTORNEY)
)
const findDepartmentOfJusticeAgencies = (countyAgencies = []) => (
  countyAgencies.filter(({type}) => type === DEPARTMENT_OF_JUSTICE)
)
const findLawEnforcementAgencies = (countyAgencies = []) => (
  countyAgencies.filter(({type}) => type === LAW_ENFORCEMENT)
)
const findLicensingAgencies = (countyAgencies = []) => (
  countyAgencies.filter(({type}) => type === COMMUNITY_CARE_LICENSING || type === COUNTY_LICENSING)
)
export default createReducer(Map(), {
  [FETCH_COUNTY_AGENCIES_SUCCESS](state, {countyAgencies}) {
    return fromJS({
      [DEPARTMENT_OF_JUSTICE]: findDepartmentOfJusticeAgencies(countyAgencies),
      [DISTRICT_ATTORNEY]: findDistrictAttorneyAgencies(countyAgencies),
      [LAW_ENFORCEMENT]: findLawEnforcementAgencies(countyAgencies),
      [LICENSING]: findLicensingAgencies(countyAgencies),
    })
  },
})
