import {CHECK_STAFF_PERMISSIONS_COMPLETE} from 'actions/staffActions'
import {Map, fromJS} from 'immutable'
import {createReducer} from 'utils/createReducer'

export default createReducer(Map(), {
  [CHECK_STAFF_PERMISSIONS_COMPLETE]: (state, {payload: permissions, error}) => {
    if (error) {
      return state
    } else {
      return fromJS(permissions)
    }
  },
})
