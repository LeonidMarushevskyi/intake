import {
  BUILD_CONTACT_SUCCESS,
  SET_CONTACT_FIELD,
  TOUCH_CONTACT_FIELD,
  TOUCH_ALL_CONTACT_FIELDS,
  SELECT_CONTACT_PERSON,
} from 'actions/contactFormActions'
import {CREATE_CONTACT_SUCCESS} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import nameFormatter from 'utils/nameFormatter'

export default createReducer(Map(), {
  [BUILD_CONTACT_SUCCESS](_state, {investigation_id, investigation_started_at, people = []}) {
    const fieldWithTouch = {value: null, touched: false}
    const fieldWithValue = (value) => ({value: value})
    return fromJS({
      id: fieldWithValue(null),
      investigation_id: fieldWithValue(investigation_id),
      started_at: fieldWithTouch,
      status: fieldWithTouch,
      note: fieldWithValue(null),
      purpose: fieldWithTouch,
      communication_method: fieldWithTouch,
      location: fieldWithTouch,
      investigation_started_at: fieldWithValue(investigation_started_at),
      people: people.map((person) => ({name: nameFormatter(person), selected: false, id: person.legacy_descriptor})),
    })
  },
  [SET_CONTACT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CONTACT_FIELD](state, {field}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_CONTACT_FIELDS](state, _) {
    const fieldsWithTouch = [
      'started_at', 'status', 'purpose', 'communication_method', 'location',
    ]
    return fieldsWithTouch.reduce(
      (contact, field) => contact.setIn([field, 'touched'], true),
      state
    )
  },
  [SELECT_CONTACT_PERSON](state, {index}) {
    return state.setIn(['people', index, 'selected'], true)
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
