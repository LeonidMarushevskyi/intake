import {
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'

const getSelectedAgenciesSelector =
  (state) => fromJS({
    [DISTRICT_ATTORNEY]: state.getIn(['crossReportForm', DISTRICT_ATTORNEY]),
    [DEPARTMENT_OF_JUSTICE]: state.getIn(['crossReportForm', DEPARTMENT_OF_JUSTICE]),
    [LAW_ENFORCEMENT]: state.getIn(['crossReportForm', LAW_ENFORCEMENT]),
    [COUNTY_LICENSING]: state.getIn(['crossReportForm', COUNTY_LICENSING]),
    [COMMUNITY_CARE_LICENSING]: state.getIn(['crossReportForm', COMMUNITY_CARE_LICENSING]),
  }).filter((agencyForm, _type) => agencyForm.get('selected'))
    .reduce((agencies, agencyForm, type) => (
      agencies.push(fromJS({type, id: agencyForm.getIn(['agency', 'value'])}))
    ), List())

export const getDistrictAttorneyFormSelector = (state) => (state.getIn(['crossReportForm', DISTRICT_ATTORNEY]) || Map())
export const getDepartmentOfJusticeFormSelector = (state) => (state.getIn(['crossReportForm', DEPARTMENT_OF_JUSTICE]) || Map())
export const getLawEnforcementFormSelector = (state) => (state.getIn(['crossReportForm', LAW_ENFORCEMENT]) || Map())
export const getCountyLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COUNTY_LICENSING]) || Map())
export const getCommunityCareLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COMMUNITY_CARE_LICENSING]) || Map())

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['crossReportForm', 'county_id', 'value']),
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']),
  (state) => state.getIn(['crossReportForm', 'method', 'value']),
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
