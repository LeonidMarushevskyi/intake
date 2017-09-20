import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_SYSTEM_CODES_SUCCESS} from 'actions/systemCodesActions'
const CONTACT_STATUS = 'contact_status'

export const findByCategory = (statusCodes = [], selectedCategory) => (
  statusCodes.filter(({category}) => category === selectedCategory)
)
export default createReducer(List(), {
  [FETCH_SYSTEM_CODES_SUCCESS](state, {systemCodes}) {
    return fromJS(findByCategory(systemCodes, CONTACT_STATUS))
  },
})
