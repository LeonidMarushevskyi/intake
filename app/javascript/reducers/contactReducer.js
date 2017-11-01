import {FETCH_CONTACT_COMPLETE} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

const getContact = (payload) => {
  const {
    communication_method,
    id,
    investigation_id,
    location,
    note,
    people,
    purpose,
    started_at,
    status,
  } = payload
  return fromJS({
    communication_method,
    id,
    investigation_id,
    location,
    note,
    people,
    purpose,
    started_at,
    status,
  })
}
export default createReducer(Map(), {
  [FETCH_CONTACT_COMPLETE](state, {payload, error}) {
    if (error) {
      return state
    } else {
      return getContact(payload)
    }
  },
})
