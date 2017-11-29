import {fromJS} from 'immutable'
import {getUserNameSelector} from 'selectors/userInfoSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('userInfoSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getFullNameSelector', () => {
    it('returns the js object payload ', () => {
      const userInfo = {first_name: 'Henry', last_name: 'Ford'}
      const state = fromJS({userInfo})
      expect(getUserNameSelector(state)).toEqual({first_name: 'Henry', last_name: 'Ford'})
    })

    it('returns empty on an empty payload', () => {
      const userInfo = {}
      const state = fromJS({userInfo})
      expect(getUserNameSelector(state)).toEqual({})
    })
  })
})