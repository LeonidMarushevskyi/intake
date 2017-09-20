import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_SUCCESS} from 'actions/systemCodesActions'
const CONTACT_PURPOSE = 'contact_purpose'
const findContactPurposes = (statusCodes = []) => (
  statusCodes.filter(({category}) => category === CONTACT_PURPOSE)
)
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_SUCCESS](state, {systemCodes}) {
    return fromJS(findContactPurposes(systemCodes))
  },
})
