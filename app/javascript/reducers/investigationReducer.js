import {createReducer} from 'utils/createReducer'
import {fromJS, Map} from 'immutable'
import {FETCH_INVESTIGATION_SUCCESS} from 'actions/investigationActions'

export default createReducer(Map(), {
  [FETCH_INVESTIGATION_SUCCESS](_state, {investigation}) {
    return fromJS(investigation)
  },
})
