export const PEOPLE_SEARCH_FETCH = 'PEOPLE_SEARCH/FETCH'
export const PEOPLE_SEARCH_FETCH_COMPLETE = 'PEOPLE_SEARCH/FETCH_COMPLETE'
export const PEOPLE_SEARCH_CLEAR = 'PEOPLE_SEARCH/CLEAR'
export const SET_SEARCH_TERM = 'PEOPLE_SEARCH/SET_SEARCH_TERM'
export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM,
  payload: {searchTerm},
})
export const search = (searchTerm) => ({
  type: PEOPLE_SEARCH_FETCH,
  payload: {searchTerm},
})
export const fetchSuccess = ({hits: {hits, total}}) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {results: hits, total},
})
export const fetchFailure = (error) => ({
  type: PEOPLE_SEARCH_FETCH_COMPLETE,
  payload: {error},
  error: true,
})
export const clear = () => ({
  type: PEOPLE_SEARCH_CLEAR,
})
