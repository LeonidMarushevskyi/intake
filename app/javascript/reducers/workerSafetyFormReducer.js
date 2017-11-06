import {
  RESET_WORKER_SAFETY_FIELD_VALUES,
  SET_WORKER_SAFETY_FIELD,
} from 'actions/workerSafetyFormActions'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {List, Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE](state, {payload: {screening}, error}) {
    if (error) {
      return state
    } else {
      const {safety_alerts, safety_information} = screening
      return fromJS({
        safety_alerts: {
          value: safety_alerts || [],
        },
        safety_information: {
          value: safety_information || '',
        },
      })
    }
  },
  [RESET_WORKER_SAFETY_FIELD_VALUES](state, {payload: {screening: {safety_alerts, safety_information}}}) {
    return state.setIn(['safety_alerts', 'value'], List(safety_alerts)).
      setIn(['safety_information', 'value'], safety_information)
  },
  [SET_WORKER_SAFETY_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], fromJS(value))
  },
})
