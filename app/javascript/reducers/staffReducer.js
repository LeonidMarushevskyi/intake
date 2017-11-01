import {CHECK_STAFF_PERMISSION_SUCCESS} from 'actions/staffActions'
import {Map, fromJS} from 'immutable'
import {createReducer} from 'utils/createReducer'

export default createReducer(Map(), {
  [CHECK_STAFF_PERMISSION_SUCCESS]: (_state, {payload: {permission, hasPermission}}) => (
    fromJS({[permission]: hasPermission})
  ),
})
