import {
  BUILD_CONTACT_SUCCESS,
  SET_CONTACT_FIELD,
  TOUCH_CONTACT_FIELD,
} from 'actions/contactFormActions'
import {CREATE_CONTACT_SUCCESS} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [BUILD_CONTACT_SUCCESS](_state, {investigation_id}) {
    const NEW_CONTACT = fromJS({
      id: {
        value: null,
      },
      investigation_id: {
        value: null,
      },
      started_at: {
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
      communication_method: {
        value: null,
        touched: false,
      },
      location: {
        value: null,
        touched: false,
      },
    })
    return NEW_CONTACT.setIn(
      ['investigation_id', 'value'], investigation_id
    )
  },
  [SET_CONTACT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CONTACT_FIELD](state, {field}) {
    return state.setIn([field, 'touched'], true)
  },
  [CREATE_CONTACT_SUCCESS](state, {id, started_at, status, note, purpose, communication_method, location}) {
    return state.setIn(['id', 'value'], id)
      .setIn(['started_at', 'value'], started_at)
      .setIn(['status', 'value'], status)
      .setIn(['note', 'value'], note)
      .setIn(['purpose', 'value'], purpose)
      .setIn(['communication_method', 'value'], communication_method)
      .setIn(['location', 'value'], location)
  },
})
