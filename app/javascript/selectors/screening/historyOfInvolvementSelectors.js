import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'
import {ROLE_TYPE_NON_REPORTER} from 'enums/RoleType'
import COUNTIES from 'enums/Counties'

const getHistoryOfInvolvementsSelector = (state) => state.get('involvements', Map())

const getCasesSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('cases', List())
)

export const getFormattedCasesSelector = createSelector(
  getCasesSelector,
  (cases) => cases.map((hoiCase) => {
    const limitedAccessCode = hoiCase.getIn(['access_limitation', 'limited_access_code'], 'N')
    const status = hoiCase.get('end_date') ? 'Closed' : 'Open'
    const serviceComponent = hoiCase.get('service_component')
    return fromJS({
      caseId: hoiCase.getIn(['legacy_descriptor', 'legacy_ui_id']),
      county: hoiCase.get('county_name'),
      dateRange: dateRangeFormatter(hoiCase.toJS()),
      focusChild: nameFormatter(hoiCase.get('focus_child', Map()).toJS()),
      parents: hoiCase.get('parents', List()).map((parent) => nameFormatter(parent.toJS())).join(', '),
      restrictedAccessStatus: accessDescription(limitedAccessCode),
      status: [status, serviceComponent].filter((n) => n).join(' - '),
      worker: nameFormatter({name_default: '', ...hoiCase.get('assigned_social_worker', Map()).toJS()}),
    })
  })
)

const getReferralsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('referrals') || List()
)

export const getFormattedReferralsSelector = createSelector(
  getReferralsSelector,
  (referrals) => referrals.map((referral) => {
    const status = referral.get('end_date') ? 'Closed' : 'Open'
    const responseTime = referral.get('response_time')
    const limitedAccessCode = referral.getIn(['access_limitation', 'limited_access_code'], 'N')
    const peopleAndRoles = referral.get('allegations', List()).map((allegation) => (Map({
      victim: nameFormatter({
        first_name: allegation.get('victim_first_name'),
        middle_name: allegation.get('victim_middle_name'),
        last_name: allegation.get('victim_last_name'),
        name_suffix: allegation.get('victim_name_suffix'),
        name_default: ''}),
      perpetrator: nameFormatter({
        first_name: allegation.get('perpetrator_first_name'),
        middle_name: allegation.get('perpetrator_middle_name'),
        last_name: allegation.get('perpetrator_last_name'),
        name_suffix: allegation.get('perpetrator_name_suffix'),
        name_default: ''}),
      allegations: allegation.get('allegation_description', ''),
      disposition: allegation.get('disposition_description', ''),
    })))
    return fromJS({
      dateRange: dateRangeFormatter(referral.toJS()),
      referralId: referral.getIn(['legacy_descriptor', 'legacy_ui_id']),
      status: [status, responseTime].filter((n) => n).join(' - '),
      notification: accessDescription(limitedAccessCode),
      county: referral.get('county_name'),
      peopleAndRoles: peopleAndRoles,
      worker: nameFormatter({name_default: '', ...referral.get('assigned_social_worker', Map()).toJS()}),
      reporter: nameFormatter({name_default: '', ...referral.get('reporter', Map()).toJS()}),
    })
  })
)

const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('screenings', List())
)

export const getFormattedScreeningsSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.map((screening) => {
    const notJustReporters = screening.get('all_people', List()).filter((person) => {
      const roles = person.get('roles', List())
      return roles.some((role) => ROLE_TYPE_NON_REPORTER.includes(role)) || roles.isEmpty()
    })
    return fromJS({
      county: COUNTIES[screening.get('county_name')] || '',
      dateRange: dateRangeFormatter(screening.toJS()),
      people: notJustReporters.map((person) => nameFormatter(person.toJS())).join(', '),
      reporter: nameFormatter({name_default: '', ...screening.get('reporter', Map()).toJS()}),
      status: screening.get('end_date') ? 'Closed' : 'In Progress',
      worker: screening.getIn(['assigned_social_worker', 'last_name'], ''),
    })
  })
)

export const getScreeningsCountSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.size
)

export const getHistoryIsEmptySelector = createSelector(
  getCasesSelector,
  getReferralsSelector,
  getScreeningsSelector,
  (cases, referrals, screenings) => !List([cases, referrals, screenings]).some((hoi) => !hoi.isEmpty())
)
