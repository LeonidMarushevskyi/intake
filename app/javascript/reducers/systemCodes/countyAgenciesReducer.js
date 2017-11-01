import {createReducer} from 'utils/createReducer'
import {List, fromJS} from 'immutable'
import {FETCH_COUNTY_AGENCIES_SUCCESS} from 'actions/countyAgenciesActions'

export default createReducer(List(), {
  [FETCH_COUNTY_AGENCIES_SUCCESS](state, {payload: {countyAgencies}}) {
    return fromJS(countyAgencies)
  },
})
