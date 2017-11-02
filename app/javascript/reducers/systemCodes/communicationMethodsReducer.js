import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_COMPLETE} from 'actions/systemCodesActions'
import {findByCategory} from 'selectors'
const COMMUNICATION_METHOD = 'communication_method'

export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_COMPLETE](state, {payload: {systemCodes}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(findByCategory(systemCodes, COMMUNICATION_METHOD))
    }
  },
})

