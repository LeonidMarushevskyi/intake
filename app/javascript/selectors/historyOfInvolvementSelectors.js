import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'
import {ROLE_TYPE_NON_REPORTER} from 'enums/RoleType'
import COUNTIES from 'enums/Counties'

export const getHistoryOfInvolvementSelector = createSelector(
  getInvestigationSelector,
  (investigation) => investigation.get('history_of_involvement') || Map()
)

const getCasesSelector = createSelector(
  getHistoryOfInvolvementSelector,
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

export const getReferralsSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('referrals') || List()
)

export const getReferralsCountSelector = createSelector(
  getReferralsSelector,
  (referrals) => referrals.size
)

const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementSelector,
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
  getReferralsCountSelector,
  getScreeningsSelector,
  (cases, referralsCount, screenings) => (
    [cases.size, referralsCount, screenings.size].reduce(
      (itemCount, sum) => sum + itemCount
    ) === 0
  )
)
