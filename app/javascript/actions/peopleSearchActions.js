export const FETCH_PEOPLE_SEARCH = 'FETCH_PEOPLE_SEARCH'
export const FETCH_PEOPLE_SEARCH_COMPLETE = 'FETCH_PEOPLE_SEARCH_COMPLETE'
export const CLEAR_PEOPLE_SEARCH = 'CLEAR_PEOPLE_SEARCH'
export const SET_SEARCH_TERM_PEOPLE_SEARCH = 'SET_SEARCH_TERM_PEOPLE_SEARCH'
export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCH_TERM_PEOPLE_SEARCH,
  payload: {searchTerm},
})
export const search = (searchTerm) => ({
  type: FETCH_PEOPLE_SEARCH,
  payload: {searchTerm},
})
export const fetchSuccess = ({hits: {hits, total}}) => ({
  type: FETCH_PEOPLE_SEARCH_COMPLETE,
  payload: {results: hits, total},
})
export const fetchFailure = (error) => ({
  type: FETCH_PEOPLE_SEARCH_COMPLETE,
  payload: {error},
  error: true,
})
export const clear = () => ({
  type: CLEAR_PEOPLE_SEARCH,
})
