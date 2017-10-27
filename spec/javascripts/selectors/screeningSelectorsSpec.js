import {fromJS, Map} from 'immutable'
import {getScreeningSelector} from 'selectors/screeningSelectors'
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
})
