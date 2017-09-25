import {
  HTTP_FAILURE,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [HTTP_FAILURE](state, action) {
    return action.responseJSON ? fromJS(action.responseJSON) : state
  },
})
