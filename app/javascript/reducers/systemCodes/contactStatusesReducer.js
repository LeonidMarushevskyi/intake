import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_SUCCESS} from 'actions/systemCodesActions'
const CONTACT_STATUS = 'contact_status'
const findContactStatuses = (statusCodes = []) => (
  statusCodes.filter(({category}) => category === CONTACT_STATUS)
)
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_SUCCESS](state, {systemCodes}) {
    return fromJS(findContactStatuses(systemCodes))
  },
})
