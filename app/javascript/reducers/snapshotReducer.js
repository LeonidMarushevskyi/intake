import {
  CREATE_SNAPSHOT_COMPLETE,
  CLEAR_SNAPSHOT,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [CREATE_SNAPSHOT_COMPLETE]: (state, {payload: {snapshot}, error}) => {
    if (error) {
      return state
    } else {
      return fromJS({...snapshot, history: {cases: [], referrals: [], screenings: []}})
    }
  },
  [CLEAR_SNAPSHOT]: () => Map(),
})
