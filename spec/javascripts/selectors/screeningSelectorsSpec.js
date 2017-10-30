import {fromJS, Map} from 'immutable'
import {
  getScreeningSelector,
  getScreeningIdValueSelector,
  getScreeningIsReadOnlySelector,
} from 'selectors/screeningSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('screeningSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getScreeningSelector', () => {
    it('returns the screening when one is present', () => {
      const screening = {report_narrative: 'ABC'}
      const state = fromJS({screening})
      expect(getScreeningSelector(state)).toEqualImmutable(fromJS(screening))
    })

    it('returns an empty map when screening is not present', () => {
      const state = Map()
      expect(getScreeningSelector(state)).toEqualImmutable(Map())
    })
  })

  describe('getScreeningIdValueSelector', () => {
    it('returns the id for the screening currently in the store', () => {
      const state = fromJS({screening: {id: '123ABC'}})
      expect(getScreeningIdValueSelector(state)).toEqual('123ABC')
    })
  })

  describe('getScreeningIsReadOnlySelector', () => {
    it('returns true if a referral id is present', () => {
      const state = fromJS({screening: {referral_id: '123456'}})
      expect(getScreeningIsReadOnlySelector(state)).toEqual(true)
    })

    it('returns false if referral id is null', () => {
      const state = fromJS({screening: {referral_id: null}})
      expect(getScreeningIsReadOnlySelector(state)).toEqual(false)
    })
  })
})
