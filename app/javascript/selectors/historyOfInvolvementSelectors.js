import {createSelector} from 'reselect'
import {Map, List} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'

export const getHistoryOfInvolvementSelector = createSelector(
  getInvestigationSelector,
  (investigation) => investigation.get('history_of_involvement') || Map()
)

export const getCasesSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('cases') || List()
)

export const getCasesCountSelector = createSelector(
  getCasesSelector,
  (cases) => cases.size
)

export const getReferralsSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('referrals') || List()
)

export const getReferralsCountSelector = createSelector(
  getReferralsSelector,
  (referrals) => referrals.size
)

export const getScreeningsSelector = createSelector(
  getHistoryOfInvolvementSelector,
  (hoi) => hoi.get('screenings') || List()
)

export const getScreeningsCountSelector = createSelector(
  getScreeningsSelector,
  (screenings) => screenings.size
)

export const getHistoryIsEmptySelector = createSelector(
  getCasesCountSelector,
  getReferralsCountSelector,
  getScreeningsCountSelector,
  (casesCount, referralsCount, screeningsCount) => (
    [casesCount, referralsCount, screeningsCount].reduce(
      (itemCount, sum) => sum + itemCount
    ) === 0
  )
)
