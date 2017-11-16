import {fromJS} from 'immutable'
import {
  getHasGenericErrorValueSelector,
} from 'selectors/errorsSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('errorsSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getHasGenericErrorValueSelector', () => {
    it('returns true when unknown errors exist', () => {
      const errors = {UNKNOWN_ACTION_TYPE: 'error'}
      const state = fromJS({errors})
      expect(getHasGenericErrorValueSelector(state)).toEqualImmutable(true)
    })

    it('returns false when unknown errors do not exist', () => {
      const errors = {}
      const state = fromJS({errors})
      expect(getHasGenericErrorValueSelector(state)).toEqualImmutable(false)
    })
  })
})
