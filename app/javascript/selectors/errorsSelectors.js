import {Map, List} from 'immutable'
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
export const getScreeningSubmissionErrorsSelector = createSelector(
  getErrors,
  (errors) => {
    if (errors.has(SUBMIT_SCREENING_COMPLETE)) {
      return errors.get(SUBMIT_SCREENING_COMPLETE).map((error) =>
        (`${error.get('property')} ${error.get('user_message')} (Incident Id: ${error.get('incident_id')})`)
      )
    } else {
      return List()
    }
  }
)
