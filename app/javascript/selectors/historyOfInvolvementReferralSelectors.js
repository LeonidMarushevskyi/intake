import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {getHistoryOfInvolvementSelector} from 'selectors/historyOfInvolvementSelectors'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'

export const getReferralsSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('referrals', List())
)

export const getReferralAtIndexSelector = (state, index) => (
  getReferralsSelector(state).get(index, Map())
)

export const getStartDateSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.get('start_date', '')
)

export const getEndDateSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.get('end_date', '')
)

export const getReferralIdSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.getIn(['legacy_descriptor', 'legacy_ui_id'], '')
)

export const getStatusSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => {
    if (referral.has('end_date')) {
      return 'Closed'
    } else {
      return 'Open'
    }
  }
)

export const getResponseTimeSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.get('response_time', '')
)

export const getStatusAndResponseTimeSelector = createSelector(
  getStatusSelector,
  getResponseTimeSelector,
  (status, responseTime) => {
    if (responseTime) {
      return List([status, responseTime]).join(' - ')
    } else {
      return status
    }
  }
)

export const getNotificationSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => accessDescription(referral.getIn(['access_limitation', 'limited_access_code'], ''))
)

export const getCountySelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.get('county_name', '')
)

export const getAllegationsSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => referral.get('allegations', List())
)

export const getWorkerSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => nameFormatter({name_default: '', ...referral.get('assigned_social_worker', Map()).toJS()})
)
export const getReporterSelector = createSelector(
  getReferralAtIndexSelector,
  (referral) => nameFormatter({name_default: '', ...referral.get('reporter', Map()).toJS()})
)

export const getPeopleAndRolesSelector = createSelector(
  getAllegationsSelector,
  (allegations) => allegations.map((allegation) => (Map({
    victim: nameFormatter({
      first_name: allegation.get('victim_first_name'),
      middle_name: allegation.get('victim_middle_name'),
      last_name: allegation.get('victim_last_name'),
      name_suffix: allegation.get('victim_name_suffix'),
      name_default: ''}) || '',
    perpetrator: nameFormatter({
      first_name: allegation.get('perpetrator_first_name'),
      middle_name: allegation.get('perpetrator_middle_name'),
      last_name: allegation.get('perpetrator_last_name'),
      name_suffix: allegation.get('perpetrator_name_suffix'),
      name_default: ''}) || '',
    allegations: allegation.get('allegation_description', ''),
    disposition: allegation.get('disposition_description', ''),
  })), List())
)
