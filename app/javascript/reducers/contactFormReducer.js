import {
  BUILD_CONTACT_SUCCESS,
  EDIT_CONTACT_SUCCESS,
  SET_CONTACT_FIELD,
  TOUCH_CONTACT_FIELD,
  TOUCH_ALL_CONTACT_FIELDS,
  SELECT_CONTACT_PERSON,
  DESELECT_CONTACT_PERSON,
} from 'actions/contactFormActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

const fieldWithTouch = (value) => ({value, touched: false})
const fieldWithValue = (value) => ({value})
const buildPerson = ({first_name, last_name, middle_name, name_suffix, legacy_descriptor, selected = false, touched = false}) => ({
  first_name,
  last_name,
  middle_name,
  name_suffix,
  legacy_descriptor,
  selected,
  touched,
})
const personLegacyId = ({legacy_descriptor}) => legacy_descriptor && legacy_descriptor.legacy_id
const buildSelectedPeople = (allPeople = [], selectedPeople = []) => {
  const selectedLegacyIds = selectedPeople.map((person) => personLegacyId(person))
  return allPeople.map((person) => {
    const legacyId = personLegacyId(person)
    const selected = legacyId && selectedLegacyIds.includes(legacyId)
    return buildPerson({...person, selected})
  })
}

export default createReducer(Map(), {
  [BUILD_CONTACT_SUCCESS](_state, {payload: {investigation_id, investigation_started_at, investigation_people = []}}) {
    return fromJS({
      id: fieldWithValue(null),
      investigation_id: fieldWithValue(investigation_id),
      started_at: fieldWithTouch(null),
      status: fieldWithTouch(null),
      note: fieldWithValue(null),
      purpose: fieldWithTouch(null),
      communication_method: fieldWithTouch(null),
      location: fieldWithTouch(null),
      investigation_started_at: fieldWithValue(investigation_started_at),
      people: buildSelectedPeople(investigation_people),
    })
  },
  [EDIT_CONTACT_SUCCESS](_state, {payload: {investigation_id, investigation_started_at, investigation_people, contact}}) {
    const {
      communication_method,
      id,
      location,
      note,
      purpose,
      started_at,
      status,
      people,
    } = contact
    return fromJS({
      id: fieldWithValue(id),
      investigation_id: fieldWithValue(investigation_id),
      started_at: fieldWithTouch(started_at),
      status: fieldWithTouch(status),
      note: fieldWithValue(note),
      purpose: fieldWithTouch(purpose),
      communication_method: fieldWithTouch(communication_method),
      location: fieldWithTouch(location),
      investigation_started_at: fieldWithValue(investigation_started_at),
      people: buildSelectedPeople(investigation_people, people),
    })
  },
  [SET_CONTACT_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_CONTACT_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_CONTACT_FIELDS](state, _) {
    const fieldsWithTouch = [
      'started_at', 'status', 'purpose', 'communication_method', 'location',
    ]
    return fieldsWithTouch.reduce(
      (contact, field) => contact.setIn([field, 'touched'], true),
      state
    ).set('people', state.get('people').map((person) => person.set('touched', true)))
  },
  [SELECT_CONTACT_PERSON](state, {payload: {index}}) {
    return state.setIn(['people', index, 'selected'], true)
      .setIn(['people', index, 'touched'], true)
  },
  [DESELECT_CONTACT_PERSON](state, {payload: {index}}) {
    return state.setIn(['people', index, 'selected'], false)
      .setIn(['people', index, 'touched'], true)
  },
})
