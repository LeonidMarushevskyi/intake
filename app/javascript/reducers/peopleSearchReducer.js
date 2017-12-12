import {createReducer} from 'utils/createReducer'
import {fromJS} from 'immutable'
import {
  CLEAR_PEOPLE_SEARCH,
  FETCH_PEOPLE_SEARCH,
  FETCH_PEOPLE_SEARCH_COMPLETE,
} from 'actions/peopleSearchActions'

const initialState = fromJS({
  results: [],
  searchTerm: '',
  total: 0,
})
export default createReducer(initialState, {
  [FETCH_PEOPLE_SEARCH](state, {payload: {searchTerm}}) {
    return state.set('searchTerm', searchTerm)
      .set('total', 0)
  },
  [FETCH_PEOPLE_SEARCH_COMPLETE](state, {payload: {results, total}, error}) {
    if (error) {
      return state
    } else {
      return state.set('results', fromJS(results))
        .set('total', total)
    }
  },
  [CLEAR_PEOPLE_SEARCH](state, _action) {
    return state.set('results', fromJS([]))
      .set('total', 0)
  },
})
