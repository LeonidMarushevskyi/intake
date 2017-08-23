import {
  CREATE_SCREENING_SUCCESS,
  FETCH_SCREENING_SUCCESS,
  UPDATE_SCREENING_SUCCESS,
  SUBMIT_SCREENING_SUCCESS,
} from 'actions/actionTypes'
import {createReducer} from 'utils/createReducer'
import {Map} from 'immutable'

export default createReducer(Map(), {
  [CREATE_SCREENING_SUCCESS](state, action) { return action.screening },
  [FETCH_SCREENING_SUCCESS](state, action) { return action.screening },
  [UPDATE_SCREENING_SUCCESS](state, action) { return action.screening },
  [SUBMIT_SCREENING_SUCCESS](state, action) { return action.screening },
})
