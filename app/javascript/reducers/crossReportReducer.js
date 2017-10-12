import {createReducer} from 'utils/createReducer'
import {Map} from 'immutable'
import {SET_CROSS_REPORT_FIELD} from 'actions/crossReportActions'

export default createReducer(Map(), {
  [SET_CROSS_REPORT_FIELD](state, {field, value}) {
    return state.setIn([field, 'value'], value)
  },
})
