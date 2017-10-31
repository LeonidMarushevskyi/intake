import {
  HTTP_FAILURE,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [HTTP_FAILURE](state, {payload}) {
    return payload ? fromJS(payload) : state
  },
})
