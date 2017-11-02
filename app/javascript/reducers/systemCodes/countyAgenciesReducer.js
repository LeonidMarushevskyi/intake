import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_COUNTY_AGENCIES_COMPLETE} from 'actions/countyAgenciesActions'

export default createReducer(List(), {
  [FETCH_COUNTY_AGENCIES_COMPLETE](state, {payload: {countyAgencies}, error}) {
    if (error) {
      return state
    } else {
      return fromJS(countyAgencies)
    }
  },
})
