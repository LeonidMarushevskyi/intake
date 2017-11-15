import {
  SET_INCIDENT_INFORMATION_FORM_FIELD,
  TOUCH_ALL_INCIDENT_INFORMATION_FORM_FIELDS,
  RESET_INCIDENT_INFORMATION_FORM_FIELDS,
  TOUCH_INCIDENT_INFORMATION_FORM_FIELD,
} from 'actions/incidentInformationFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) {
      return state
    } else {
      const {
        incident_date,
        incident_county,
        address: {street_address, city, state: usState, zip},
        location_type,
      } = screening

      return fromJS({
        incident_date: {
          value: incident_date,
          touched: false,
        },
        incident_county: {
          value: incident_county,
          touched: false,
        },
        address: {
          city: {
            value: city,
            touched: false,
          },
          state: {
            value: usState,
            touched: false,
          },
          street_address: {
            value: street_address,
            touched: false,
          },
          zip: {
            value: zip,
            touched: false,
          },
        },
        location_type: {
          value: location_type,
          touched: false,
        },
      })
    }
  },
  [SET_INCIDENT_INFORMATION_FORM_FIELD](state, {payload: {fieldSet, value}}) {
    return state.setIn([...fieldSet, 'value'], value)
  },
  [TOUCH_ALL_INCIDENT_INFORMATION_FORM_FIELDS](state) {
    return state.setIn(['incident_date', 'touched'], true)
      .setIn(['incident_county', 'touched'], true)
      .setIn(['address', 'street_address', 'touched'], true)
      .setIn(['address', 'city', 'touched'], true)
      .setIn(['address', 'state', 'touched'], true)
      .setIn(['address', 'zip', 'touched'], true)
      .setIn(['location_type', 'touched'], true)
  },
  [TOUCH_INCIDENT_INFORMATION_FORM_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [RESET_INCIDENT_INFORMATION_FORM_FIELDS](state, {payload: {screening}}) {
    const {
      incident_date,
      incident_county,
      address: {street_address, city, state: usState, zip},
      location_type,
    } = screening
    return state.setIn(['incident_date', 'value'], incident_date)
      .setIn(['incident_county', 'value'], incident_county)
      .setIn(['address', 'street_address', 'value'], street_address)
      .setIn(['address', 'city', 'value'], city)
      .setIn(['address', 'state', 'value'], usState)
      .setIn(['address', 'zip', 'value'], zip)
      .setIn(['location_type', 'value'], location_type)
  },
})
