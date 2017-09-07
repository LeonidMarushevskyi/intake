import {createReducer} from 'utils/createReducer'
import {fromJS, Map} from 'immutable'
import {FETCH_SCREENING_SUMMARY_SUCCESS} from 'actions/screeningSummaryActions'

const getScreeningSummary = (state, {screeningSummary}) => (fromJS(screeningSummary))

export default createReducer(Map(), {
  [FETCH_SCREENING_SUMMARY_SUCCESS]: getScreeningSummary,
})
