import {createReducer} from 'utils/createReducer'
import {findByCategory} from 'selectors'
import {FETCH_SYSTEM_CODES_COMPLETE} from 'actions/systemCodesActions'
import {List, fromJS} from 'immutable'

const SCREEN_RESPONSE_TIME = 'screen_response_time'
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_COMPLETE](state, {payload: {systemCodes}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(findByCategory(systemCodes, SCREEN_RESPONSE_TIME))
    }
  },
})
