import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess, fetchFailure} from 'actions/screeningsActions'
import screeningsReducer from 'reducers/screeningsReducer'
import {List, fromJS} from 'immutable'

describe('screeningsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENINGS_COMPLETE', () => {
    it('returns fetched screenings on success', () => {
      const action = fetchSuccess([{id: 1}, {id: 2}])
      expect(screeningsReducer(List(), action)).toEqualImmutable(
        fromJS([{id: 1}, {id: 2}])
      )
    })
    it('returns last state on failure', () => {
      const action = fetchFailure()
      expect(screeningsReducer(List(), action)).toEqualImmutable(List())
    })
  })
})
