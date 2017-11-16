import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getGenericErrors = (state) => state.getIn(['errors', 'unknown'], Map())
export const getHasGenericErrorValueSelector = createSelector(
  getGenericErrors,
  (genericErrors) => (genericErrors.size > 0)
)
