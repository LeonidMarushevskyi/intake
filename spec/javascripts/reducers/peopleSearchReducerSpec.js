import * as matchers from 'jasmine-immutable-matchers'
import {clear, search, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'
import peopleSearchReducer from 'reducers/peopleSearchReducer'
import {Map, fromJS} from 'immutable'

describe('peopleSearchReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on FETCH_PEOPLE_SEARCH', () => {
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
  describe('on FETCH_PEOPLE_SEARCH_COMPLETE', () => {
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
  describe('on CLEAR_PEOPLE_SEARCH', () => {
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
})
