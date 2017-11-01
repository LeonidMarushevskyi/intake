import {
  RESET_NARRATIVE_FIELD_VALUES,
  SET_NARRATIVE_FIELD,
  TOUCH_NARRATIVE_FIELD,
  TOUCH_ALL_NARRATIVE_FIELDS,
} from 'actions/narrativeFormActions'
import {FETCH_SCREENING_SUCCESS} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_SCREENING_SUCCESS](_state, {payload: {screening: {report_narrative}}}) {
    return fromJS({
      report_narrative: {
        value: report_narrative || '',
        touched: false,
      },
    })
  },
  [RESET_NARRATIVE_FIELD_VALUES](state, {payload: {screening: {report_narrative}}}) {
    return state.setIn(['report_narrative', 'value'], report_narrative)
  },
  [SET_NARRATIVE_FIELD](state, {payload: {field, value}}) {
    return state.setIn([field, 'value'], value)
  },
  [TOUCH_NARRATIVE_FIELD](state, {payload: {field}}) {
    return state.setIn([field, 'touched'], true)
  },
  [TOUCH_ALL_NARRATIVE_FIELDS](state, _) {
    return state.setIn(['report_narrative', 'touched'], true)
  },
})
