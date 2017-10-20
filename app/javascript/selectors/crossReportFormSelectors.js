import {
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {createSelector} from 'reselect'
import {fromJS, List} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'

const getSelectedAgencies =
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

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['crossReportForm', 'county_id', 'value']),
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']),
  (state) => state.getIn(['crossReportForm', 'method', 'value']),
  getSelectedAgencies,
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
