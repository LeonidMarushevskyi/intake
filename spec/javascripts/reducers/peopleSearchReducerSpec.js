import * as matchers from 'jasmine-immutable-matchers'
import {
  clear,
  fetchFailure,
  fetchSuccess,
  search,
  setSearchTerm,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'
import peopleSearchReducer from 'reducers/peopleSearchReducer'
import {Map, fromJS} from 'immutable'

describe('peopleSearchReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on PEOPLE_SEARCH_FETCH', () => {
    it('updates the search term and total', () => {
      const action = search('newSearchTerm')
      expect(peopleSearchReducer(Map(), action)).toEqualImmutable(
        fromJS({
          searchTerm: 'newSearchTerm',
          total: 0,
        })
      )
    })
  })
  describe('on PEOPLE_SEARCH_FETCH_COMPLETE', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 0,
    })
    describe('on success', () => {
      const action = fetchSuccess({
        hits: {
          total: 2,
          hits: ['result_one', 'result_two'],
        },
      })
      it('updates search results with hits and sets the new total', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchTerm: 'newSearchTerm',
            total: 2,
            results: ['result_one', 'result_two'],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = fetchFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(initialState)
      })
    })
  })
  describe('on PEOPLE_SEARCH_CLEAR', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 3,
      results: ['result_one', 'result_two', 'result_three'],
    })
    const action = clear()
    it('resets results and total', () => {
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          searchTerm: 'newSearchTerm',
          total: 0,
          results: [],
        })
      )
    })
  })
  describe('on SET_SEARCH_TERM', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 3,
      results: ['result_one', 'result_two', 'result_three'],
    })
    const action = setSearchTerm('something')
    it('resets results and total', () => {
      expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
        fromJS({
          searchTerm: 'something',
          total: 3,
          results: ['result_one', 'result_two', 'result_three'],
        })
      )
    })
  })
  describe('on LOAD_MORE_RESULTS_COMPLETE', () => {
    const initialState = fromJS({
      searchTerm: 'newSearchTerm',
      total: 4,
      results: ['result_one', 'result_two'],
    })
    describe('on success', () => {
      const action = loadMoreResultsSuccess({
        hits: {
          hits: ['result_three', 'result_four'],
        },
      })
      it('updates search results with hits', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(
          fromJS({
            searchTerm: 'newSearchTerm',
            total: 4,
            results: [
              'result_one', 'result_two', 'result_three', 'result_four',
            ],
          })
        )
      })
    })
    describe('on failure', () => {
      const action = loadMoreResultsFailure()
      it('leaves state unchanged', () => {
        expect(peopleSearchReducer(initialState, action)).toEqualImmutable(initialState)
      })
    })
  })
})
