import {SET_SCREENING_PAGE_MODE} from 'actions/screeningPageActions'
import {Map} from 'immutable'
import {createReducer} from 'utils/createReducer'

export default createReducer(Map(), {
  [SET_SCREENING_PAGE_MODE]: (state, {payload: {mode}}) => state.set('mode', mode),
})
