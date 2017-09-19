import {SET_CONTACT, SET_CONTACT_FIELD, TOUCH_CONTACT_FIELD} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [SET_CONTACT](_state, {investigation_id, started_at, status, note}) {
    return fromJS(
      {
        investigation_id: {
          value: investigation_id,
        },
        started_at: {
          value: started_at,
          touched: false,
        },
        status: {
          value: status,
          touched: false,
        },
        note: {
          value: note,
        },
      }
    )
  },
  [SET_CONTACT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CONTACT_FIELD](state, {field}) {
    return state.setIn([field, 'touched'], true)
  },
})
