import {fromJS} from 'immutable'
import {
  getHasGenericErrorValueSelector,
  getTotalScreeningSubmissionErrorValueSelector,
} from 'selectors/errorsSelectors'
import {SUBMIT_SCREENING_COMPLETE} from 'actions/actionTypes'
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
  describe('getTotalScreeningSubmissionErrorValueSelector', () => {
    it('returns count of screening submission errors', () => {
      const errors = {[SUBMIT_SCREENING_COMPLETE]: ['error one', 'error two']}
      const state = fromJS({errors})
      expect(getTotalScreeningSubmissionErrorValueSelector(state)).toEqualImmutable(2)
    })
    it('returns 0 when no screening submission errors exist', () => {
      const state = fromJS({errors: {}})
      expect(getTotalScreeningSubmissionErrorValueSelector(state)).toEqualImmutable(0)
    })
  })
})
