import {fromJS} from 'immutable'
import {SUBMIT_SCREENING_COMPLETE} from 'actions/actionTypes'

const initialState = fromJS({})

export default function errorsReducer(state = initialState, action) {
  const {payload, error, type} = action
  if (error) {
    switch (type) {
      case SUBMIT_SCREENING_COMPLETE: {
        const {error: {api_response_body: {issue_details = []}}} = payload
        if (issue_details) {
          return state.set(type, fromJS(issue_details))
        } else {
          return state.set(type, fromJS(payload))
        }
      }
      default:
        return state.set(type, fromJS(payload))
    }
  } else {
    return state.delete(type)
  }
}
