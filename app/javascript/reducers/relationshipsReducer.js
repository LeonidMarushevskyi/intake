import {
  CREATE_SCREENING_COMPLETE,
  FETCH_RELATIONSHIPS_COMPLETE,
  CLEAR_RELATIONSHIPS,
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
  [FETCH_RELATIONSHIPS_COMPLETE](state, {payload: {relationships}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(relationships)
    }
  },
  [CLEAR_RELATIONSHIPS]() {
    return List()
  },
})
