import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_USER_INFO_COMPLETE} from 'actions/userInfoActions'

export default createReducer(Map(), {
  [FETCH_USER_INFO_COMPLETE](state, {payload: {userInfo}}) {
    return fromJS(userInfo)
  },
})
