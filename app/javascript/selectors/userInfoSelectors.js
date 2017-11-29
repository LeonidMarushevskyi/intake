import {Map} from 'immutable'
import {createSelector} from 'reselect'

export const getUserInfo = (state) => state.get('userInfo', Map())
export const getUserNameSelector = createSelector(
  getUserInfo,
  (userInfo) => userInfo.toJS()
)