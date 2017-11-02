import {
  CREATE_SCREENING_COMPLETE,
  FETCH_RELATIONSHIPS_COMPLETE,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'

export default createReducer(List(), {
  [CREATE_SCREENING_COMPLETE](state, {error}) {
    if (error) {
      return state
    } else {
      return List()
    }
  },
  [FETCH_RELATIONSHIPS_COMPLETE](state, {payload, error}) {
    if (error) {
      return state
    } else {
      return fromJS(payload.relationships)
    }
  },
})
