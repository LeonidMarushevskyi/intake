import {createReducer} from 'utils/createReducer'
import {fromJS} from 'immutable'
import {
  PEOPLE_SEARCH_CLEAR,
  PEOPLE_SEARCH_FETCH,
  PEOPLE_SEARCH_FETCH_COMPLETE,
  SET_SEARCH_TERM,
} from 'actions/peopleSearchActions'

const initialState = fromJS({
  results: [],
  searchTerm: '',
  total: 0,
})
export default createReducer(initialState, {
  [PEOPLE_SEARCH_FETCH](state, {payload: {searchTerm}}) {
    return state.set('searchTerm', searchTerm)
      .set('total', 0)
  },
  [PEOPLE_SEARCH_FETCH_COMPLETE](state, {payload: {results, total}, error}) {
    if (error) {
      return state
    } else {
      return state.set('results', fromJS(results))
        .set('total', total)
    }
  },
  [PEOPLE_SEARCH_CLEAR](state, _action) {
    return state.set('results', fromJS([]))
      .set('total', 0)
  },
  [SET_SEARCH_TERM](state, {payload: {searchTerm}}) {
    return state.set('searchTerm', searchTerm)
  },
})
