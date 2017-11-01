import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_COMPLETE} from 'actions/systemCodesActions'
import {findByCategory} from 'selectors'

const CONTACT_STATUS = 'contact_status'
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_COMPLETE](state, {payload: {systemCodes}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(findByCategory(systemCodes, CONTACT_STATUS))
    }
  },
})
