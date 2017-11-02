import {FETCH_SCREENINGS_COMPLETE} from 'actions/screeningsActions'
import {List, fromJS} from 'immutable'
import {createReducer} from 'utils/createReducer'

export default createReducer(List(), {
  [FETCH_SCREENINGS_COMPLETE]: (state, {payload: {screenings}, error}) => {
    if (error) {
      return state
    } else {
      return fromJS(screenings)
    }
  },
})
