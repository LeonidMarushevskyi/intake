import {FETCH_CONTACT_SUCCESS} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_CONTACT_SUCCESS](_state, action) {
    const {
      id,
      started_at,
      status,
      note,
      purpose,
      communication_method,
      location,
      investigation_id,
    } = action
    return fromJS({
      id,
      started_at,
      status,
      note,
      purpose,
      communication_method,
      location,
      investigation_id,
    })
  },
})
