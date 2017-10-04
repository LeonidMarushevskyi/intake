import {createReducer} from 'utils/createReducer'
import {fromJS, Map} from 'immutable'
import {FETCH_INVESTIGATION_SUCCESS} from 'actions/investigationActions'

const getInvestigation = (state, {investigation}) => fromJS(investigation)

export default createReducer(Map(), {
  [FETCH_INVESTIGATION_SUCCESS]: getInvestigation,
})
