import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {getHistoryOfInvolvementSelector} from 'selectors/historyOfInvolvementSelectors'
import nameFormatter from 'utils/nameFormatter'
import {accessDescription} from 'utils/accessIndicator'

export const getCasesSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('cases', List())
)

export const getCaseAtIndexSelector = (state, index) => (
  getCasesSelector(state).get(index, Map())
)

export const getFormattedParentNamesSelector = createSelector(
  getCaseAtIndexSelector,
  (hoiCase) => hoiCase.get('parents', List()).map(
    (parent) => nameFormatter(parent.toJS())
  ).join(', ')
)

export const getRestrictedAccessStatusSelector = createSelector(
  getCaseAtIndexSelector,
  (hoiCase) => {
    const accessLimitation = hoiCase.get('access_limitation')
    const limitedAccessCode = accessLimitation ? accessLimitation.get('limited_access_code') : 'N'
    return accessDescription(limitedAccessCode)
  }
)

export const getStatusAndServiceComponentStringSelector = createSelector(
  (state, index) => {
    if (getCaseAtIndexSelector(state, index).get('end_date')) {
      return 'Closed'
    } else {
      return 'Open'
    }
  },
  (state, index) => getCaseAtIndexSelector(state, index).get('service_component'),
  (status, service_component) => [status, service_component].filter((n) => n).join(' - ')
)
