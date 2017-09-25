import {SET_CONTACT, SET_CONTACT_FIELD, TOUCH_CONTACT_FIELD} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [SET_CONTACT](_state, {investigation_id}) {
    return fromJS(
      {
        id: {
          value: null,
        },
        investigation_id: {
          value: investigation_id,
        },
        started_at: {
          value: null,
          touched: false,
        },
        communication_method: {
          value: null,
          touched: false,
        },
        location: {
          value: null,
          touched: false,
        },
        status: {
          value: null,
          touched: false,
        },
        note: {
          value: null,
        },
        purpose: {
          value: null,
          touched: false,
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
