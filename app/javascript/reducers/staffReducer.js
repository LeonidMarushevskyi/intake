import {
  CHECK_STAFF_PERMISSION_SUCCESS,
} from 'actions/staffActionTypes'
import {Map, fromJS} from 'immutable'
import {createReducer} from 'utils/createReducer'

export default createReducer(Map(), {
  [CHECK_STAFF_PERMISSION_SUCCESS]: (state, {permission, hasPermission}) => {
    const obj = {}
    obj[permission] = hasPermission
    return fromJS(obj)
  },
})
