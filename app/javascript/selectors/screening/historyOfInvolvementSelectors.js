import {createSelector} from 'reselect'
import {Map, List, fromJS} from 'immutable'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'
import {dateRangeFormatter} from 'utils/dateFormatter'
import {ROLE_TYPE_NON_REPORTER} from 'enums/RoleType'
import COUNTIES from 'enums/Counties'
import {systemCodeDisplayValue, getScreenResponseTimesSelector} from 'selectors/systemCodeSelectors'
import * as IntakeConfig from 'common/config'

const getHistoryOfInvolvementsSelector = (state) => state.get('involvements', Map())

const getCasesSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('cases', List())
)

const formatDisposition = (disposition) => {
  const formattedDisposition = disposition ? `(${ disposition })` : ''
  return formattedDisposition
}

const getCaseCountyAndStatus = (hoiCase) => {
  const status = hoiCase.get('end_date') ? 'Closed' : 'Open'
  if (IntakeConfig.isFeatureActive('release_two')) {
    const serviceComponent = hoiCase.get('service_component')
    return {
      county: hoiCase.get('county_name'),
      status: [status, serviceComponent].filter((n) => n).join(' - '),
    }
  } else {
    const serviceComponent = hoiCase.getIn(['service_component', 'description'])
    return {
      county: hoiCase.getIn(['county', 'description']),
      status: [status, serviceComponent].filter((n) => n).join(' - '),
    }
  }
}

export const getFormattedCasesSelector = createSelector(
  getCasesSelector,
  (cases) => cases.map((hoiCase) => {
    const {county, status} = getCaseCountyAndStatus(hoiCase)
    const limitedAccessCode = hoiCase.getIn(['access_limitation', 'limited_access_code'], 'NONE')
    return fromJS({
      caseId: hoiCase.getIn(['legacy_descriptor', 'legacy_ui_id']),
      county: county,
      dateRange: dateRangeFormatter(hoiCase.toJS()),
      focusChild: nameFormatter(hoiCase.get('focus_child', Map()).toJS()),
      parents: hoiCase.get('parents', List()).map((parent) => nameFormatter(parent.toJS())).join(', '),
      restrictedAccessStatus: accessDescription(limitedAccessCode),
      status: status,
      worker: nameFormatter({name_default: '', ...hoiCase.get('assigned_social_worker', Map()).toJS()}),
    })
  })
)

const getReferralsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('referrals') || List()
)

const getReferralCountyAndStatus = (referral, responseTimes) => {
  const status = referral.get('end_date') ? 'Closed' : 'Open'
  if (IntakeConfig.isFeatureActive('release_two')) {
    const responseTime = referral.get('response_time')
    return {
      county: referral.get('county_name'),
      status: [status, responseTime].filter((n) => n).join(' - '),
    }
  } else {
    const responseTimeID = referral.getIn(['response_time', 'id'])
    const responseTime = systemCodeDisplayValue(responseTimeID, responseTimes)
    return {
      county: referral.getIn(['county', 'description']),
      status: [status, responseTime].filter((n) => n).join(' - '),
    }
  }
}

const getReferralAllegationPeopleAndRoles = (allegation) => {
  if (IntakeConfig.isFeatureActive('release_two')) {
    return Map({
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
      disposition: formatDisposition(allegation.get('disposition_description')),
    })
  } else {
    return Map({
      victim: nameFormatter({
        first_name: allegation.getIn(['victim', 'first_name']),
        middle_name: allegation.getIn(['victim', 'middle_name']),
        last_name: allegation.getIn(['victim', 'last_name']),
        name_suffix: allegation.getIn(['victim', 'name_suffix']),
        name_default: ''}),
      perpetrator: nameFormatter({
        first_name: allegation.getIn(['perpetrator', 'first_name']),
        middle_name: allegation.getIn(['perpetrator', 'middle_name']),
        last_name: allegation.getIn(['perpetrator', 'last_name']),
        name_suffix: allegation.getIn(['perpetrator', 'name_suffix']),
        name_default: ''}),
      allegations: allegation.getIn(['type', 'description'], ''),
      disposition: formatDisposition(allegation.getIn(['disposition', 'description'])),
    })
  }
}

export const getFormattedReferralsSelector = createSelector(
  getReferralsSelector,
  getScreenResponseTimesSelector,
  (referrals, responseTimes) => referrals.map((referral) => {
    const {county, status} = getReferralCountyAndStatus(referral, responseTimes)
    const limitedAccessCode = referral.getIn(['access_limitation', 'limited_access_code'], 'NONE')
    const peopleAndRoles = referral.get('allegations', List())
      .map((allegation) => getReferralAllegationPeopleAndRoles(allegation))
    return fromJS({
      county: county,
      dateRange: dateRangeFormatter(referral.toJS()),
      notification: accessDescription(limitedAccessCode),
      peopleAndRoles: peopleAndRoles,
      referralId: referral.getIn(['legacy_descriptor', 'legacy_ui_id']),
      reporter: nameFormatter({name_default: '', ...referral.get('reporter', Map()).toJS()}),
      status: status,
      worker: nameFormatter({name_default: '', ...referral.get('assigned_social_worker', Map()).toJS()}),
    })
  })
)

const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementsSelector,
  (hoi) => hoi.get('screenings', List())
)

const getScreeningCountyAndWorker = (screening) => {
  if (IntakeConfig.isFeatureActive('release_two')) {
    return {
      county: COUNTIES[screening.get('county_name')] || '',
      worker: screening.getIn(['assigned_social_worker', 'last_name'], ''),
    }
  } else {
    return {
      county: screening.getIn(['county', 'description'], ''),
      worker: nameFormatter({name_default: '', ...screening.get('assigned_social_worker', Map()).toJS()}),
    }
  }
}

export const getFormattedScreeningsSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.map((screening) => {
    const notJustReporters = screening.get('all_people', List()).filter((person) => {
      const roles = person.get('roles', List())
      return roles.some((role) => ROLE_TYPE_NON_REPORTER.includes(role)) || roles.isEmpty()
    })
    const {county, worker} = getScreeningCountyAndWorker(screening)
    return fromJS({
      county: county,
      dateRange: dateRangeFormatter(screening.toJS()),
      people: notJustReporters.map((person) => nameFormatter(person.toJS())).join(', '),
      reporter: nameFormatter({name_default: '', ...screening.get('reporter', Map()).toJS()}),
      status: screening.get('end_date') ? 'Closed' : 'In Progress',
      worker: worker,
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
  (cases, referrals, screenings) => List([cases, referrals, screenings]).every((involvement) => involvement.isEmpty())
)
