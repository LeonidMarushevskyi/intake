import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess as fetchUserInfoSuccess} from 'actions/userInfoActions'
import userInfoReducer from 'reducers/userInfoReducer'
import {Map} from 'immutable'

describe('userInfoReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on FETCH_USER_INFO_COMPLETE', () => {
    it('returns the current user information', () => {
      const action = fetchUserInfoSuccess({first_name: 'Alan', last_name: 'Turing'})
      expect(userInfoReducer(Map(), action)).toEqualImmutable(
        Map(Map({first_name: 'Alan', last_name: 'Turing'}))
      )
    })
  })
})
