import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getGenericErrors = (state) => state.get('errors', Map())
export const getHasGenericErrorValueSelector = createSelector(
  getGenericErrors,
  (genericErrors) => (genericErrors.size > 0)
)
