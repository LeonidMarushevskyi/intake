import {SET_CONTACT} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [SET_CONTACT](_state, {investigation_id, started_at}) {
    return fromJS({investigation_id, started_at})
  },
})
