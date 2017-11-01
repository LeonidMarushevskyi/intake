import {
  FETCH_SCREENING,
  CREATE_SCREENING_SUCCESS,
  FETCH_SCREENING_SUCCESS,
  UPDATE_SCREENING_SUCCESS,
  SUBMIT_SCREENING_SUCCESS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

const getScreening = (state, {payload: {screening}}) => fromJS({
  ...screening,
  fetch_status: 'FETCHED',
})

export default createReducer(Map(), {
  [FETCH_SCREENING]: (_state, _action) => Map({fetch_status: 'FETCHING'}),
  [CREATE_SCREENING_SUCCESS]: getScreening,
  [FETCH_SCREENING_SUCCESS]: getScreening,
  [UPDATE_SCREENING_SUCCESS]: getScreening,
  [SUBMIT_SCREENING_SUCCESS]: getScreening,
})
