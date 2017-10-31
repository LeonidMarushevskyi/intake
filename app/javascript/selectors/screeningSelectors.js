import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getScreeningSelector = (state) => state.get('screening', Map())

export const getScreeningIdValueSelector = createSelector(
  getScreeningSelector,
  (screening) => screening.get('id')
)

export const getScreeningIsReadOnlySelector = createSelector(
  getScreeningSelector,
  (screening) => Boolean(screening.get('referral_id'))
)
