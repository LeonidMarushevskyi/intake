import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_SUCCESS} from 'actions/systemCodesActions'
import {findByCategory} from 'selectors'
const CONTACT_PURPOSE = 'contact_purpose'
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_SUCCESS](state, {payload: {systemCodes}}) {
    return fromJS(findByCategory(systemCodes, CONTACT_PURPOSE))
  },
})
