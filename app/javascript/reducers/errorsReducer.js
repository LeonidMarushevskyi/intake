import {fromJS} from 'immutable'
import {FETCH_SCREENINGS} from 'actions/screeningsActions'

const initialState = fromJS({})

export default function errorsReducer(state = initialState, action) {
  const {payload, error, type} = action
  if (error) {
    const {error: {responseJSON = {}} = {}} = payload
    const {api_response_body: {issue_details} = {}} = responseJSON
    if (issue_details) {
      return state.set(type, fromJS(issue_details))
    } else {
      return state.set(type, fromJS(payload))
    }
  } else if (action.type === FETCH_SCREENINGS && action.error !== true) {
    return initialState
  } else {
    return state.delete(type)
  }
}
