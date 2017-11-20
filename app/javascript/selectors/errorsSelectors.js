import {Map} from 'immutable'
import {createSelector} from 'reselect'
import {SUBMIT_SCREENING_COMPLETE} from 'actions/actionTypes'

export const getErrors = (state) => state.get('errors', Map())
export const getHasGenericErrorValueSelector = createSelector(
  getErrors,
  (errors) => (errors.size > 0)
)
export const getTotalScreeningSubmissionErrorValueSelector = createSelector(
  getErrors,
  (errors) => {
    if (errors.has(SUBMIT_SCREENING_COMPLETE)) {
      return errors.get(SUBMIT_SCREENING_COMPLETE).size
    } else {
      return 0
    }
  }
)
