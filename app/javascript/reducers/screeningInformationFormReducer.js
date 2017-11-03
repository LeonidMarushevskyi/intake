import {
  RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES,
  SET_SCREENING_INFORMATION_FORM_FIELD,
  TOUCH_SCREENING_INFORMATION_FORM_FIELD,
  TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS,
} from 'actions/screeningInformationFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) {
      return state
    } else {
      const {
        name,
        assignee,
        started_at,
        ended_at,
        communication_method,
      } = screening
      return fromJS({
        name: {
          value: name,
          touched: false,
        },
        assignee: {
          value: assignee,
          touched: false,
        },
        started_at: {
          value: started_at,
          touched: false,
        },
        ended_at: {
          value: ended_at,
          touched: false,
        },
        communication_method: {
          value: communication_method,
          touched: false,
        },
      })
    }
  },
  [RESET_SCREENING_INFORMATION_FORM_FIELD_VALUES](state, {payload: {name, assignee, started_at, ended_at, communication_method}}) {
    return state.setIn(['name', 'value'], name)
      .setIn(['assignee', 'value'], assignee)
      .setIn(['started_at', 'value'], started_at)
      .setIn(['ended_at', 'value'], ended_at)
      .setIn(['communication_method', 'value'], communication_method)
  },
  [SET_SCREENING_INFORMATION_FORM_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_SCREENING_INFORMATION_FORM_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_SCREENING_INFORMATION_FORM_FIELDS](state, _) {
    return state.setIn(['name', 'touched'], true)
      .setIn(['assignee', 'touched'], true)
      .setIn(['started_at', 'touched'], true)
      .setIn(['ended_at', 'touched'], true)
      .setIn(['communication_method', 'touched'], true)
  },
})
