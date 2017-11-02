import {createReducer} from 'utils/createReducer'
import {fromJS, Map} from 'immutable'
import {FETCH_INVESTIGATION_COMPLETE} from 'actions/investigationActions'

export default createReducer(Map(), {
  [FETCH_INVESTIGATION_COMPLETE](state, {payload: {investigation}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(investigation)
    }
  },
})
