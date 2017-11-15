import {
  AGENCY_TYPES,
  COMMUNITY_CARE_LICENSING,
  COUNTY_LICENSING,
  CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS,
  DEPARTMENT_OF_JUSTICE,
  DISTRICT_ATTORNEY,
  LAW_ENFORCEMENT,
} from 'enums/CrossReport'
import {
  isRequiredIfCreate,
  combineCompact,
} from 'utils/validator'
import {
  getAgencyRequiredErrors,
  getCommunityCareLicensingErrors,
  getCountyLicensingErrors,
  getDepartmentOfJusticeErrors,
  getDistrictAttorneyErrors,
  getLawEnforcementErrors,
} from 'selectors/crossReportShowSelectors'
import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {areCrossReportsRequired} from 'utils/allegationsHelper'

export const getDistrictAttorneyFormSelector = (state) => (state.getIn(['crossReportForm', DISTRICT_ATTORNEY]) || Map())
export const getDepartmentOfJusticeFormSelector = (state) => (state.getIn(['crossReportForm', DEPARTMENT_OF_JUSTICE]) || Map())
export const getLawEnforcementFormSelector = (state) => (state.getIn(['crossReportForm', LAW_ENFORCEMENT]) || Map())
export const getCountyLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COUNTY_LICENSING]) || Map())
export const getCommunityCareLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COMMUNITY_CARE_LICENSING]) || Map())

const getSelectedAgenciesSelector = createSelector(
  getCommunityCareLicensingFormSelector,
  getCountyLicensingFormSelector,
  getDepartmentOfJusticeFormSelector,
  getDistrictAttorneyFormSelector,
  getLawEnforcementFormSelector,
  (communityCareLicensing, countyLicensing, departmentOfJustice, districtAttorney, lawEnforcement) => fromJS({
    [COMMUNITY_CARE_LICENSING]: communityCareLicensing,
    [COUNTY_LICENSING]: countyLicensing,
    [DEPARTMENT_OF_JUSTICE]: departmentOfJustice,
    [DISTRICT_ATTORNEY]: districtAttorney,
    [LAW_ENFORCEMENT]: lawEnforcement,
  }).filter((agencyForm, _type) => agencyForm.get('selected'))
    .reduce((agencies, agencyForm, type) => (
      agencies.push(fromJS({type, id: agencyForm.getIn(['agency', 'value'])}))
    ), List())
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['crossReportForm', 'county_id', 'value']) || null,
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']) || null,
  (state) => state.getIn(['crossReportForm', 'method', 'value']) || null,
  getSelectedAgenciesSelector,
  (
    screening,
    county_id,
    inform_date,
    method,
    agencies
  ) => screening
    .setIn(['cross_reports', 0, 'county_id'], county_id)
    .setIn(['cross_reports', 0, 'inform_date'], inform_date)
    .setIn(['cross_reports', 0, 'method'], method)
    .setIn(['cross_reports', 0, 'agencies'], agencies)
)

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']),
  (state) => state.getIn(['crossReportForm', 'method', 'value']),
  getSelectedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (informDate, method, agencies, allegations) => fromJS({
    inform_date: combineCompact(isRequiredIfCreate(informDate, 'Please enter a cross-report date.', () => (agencies.size !== 0))),
    method: combineCompact(isRequiredIfCreate(method, 'Please select cross-report communication method.', () => (agencies.size !== 0))),
    [COMMUNITY_CARE_LICENSING]: combineCompact(() => (getCommunityCareLicensingErrors(agencies))),
    [COUNTY_LICENSING]: combineCompact(() => (getCountyLicensingErrors(agencies))),
    [DEPARTMENT_OF_JUSTICE]: combineCompact(() => (getDepartmentOfJusticeErrors(agencies))),
    [DISTRICT_ATTORNEY]: combineCompact(() => (
      getDistrictAttorneyErrors(agencies) ||
      getAgencyRequiredErrors(DISTRICT_ATTORNEY, agencies, allegations)
    )),
    [LAW_ENFORCEMENT]: combineCompact(() => (
      getLawEnforcementErrors(agencies) ||
      getAgencyRequiredErrors(LAW_ENFORCEMENT, agencies, allegations)
    )),
  })
)

export const getTouchedAgenciesSelector = createSelector(
  (state) => state.get('crossReportForm'),
  (crossReportForm) => crossReportForm.filter((field) => field.getIn(['agency', 'touched'])).keySeq()
)
export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('crossReportForm'),
  (crossReportForm) => crossReportForm.filter((field) => field.get('touched')).keySeq()
)

export const getVisibleErrorsSelector = createSelector(
  getErrorsSelector,
  getTouchedFieldsSelector,
  getTouchedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (errors, touchedFields, touchedAgencies, allegations) => errors.reduce(
    (filteredErrors, fieldErrors, field) => {
      if (touchedAgencies.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      } else if (AGENCY_TYPES[field]) {
        if (areCrossReportsRequired(allegations) && touchedFields.includes(field)) {
          return filteredErrors.set(field, fieldErrors)
        }
      } else if (touchedFields.includes(field)) {
        return filteredErrors.set(field, fieldErrors)
      }
      return filteredErrors.set(field, List())
    }, Map())
)

export const getAllegationsRequireCrossReportsValueSelector = createSelector(
  getSelectedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (agencies, allegations) => areCrossReportsRequired(allegations) && !CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS.reduce((hasRequiredAgencies, requiredAgencyType) => hasRequiredAgencies && Boolean(agencies.find((agency) => (
    agency.get('type') === requiredAgencyType
  ))), true)
)
