import {fromJS, Map} from 'immutable'
import {getInvestigationSelector} from 'selectors/investigationSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('investigationSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getInvestigationSelector', () => {
    it('returns the current investigation if one exists', () => {
      const investigation = {started_at: '01/02/03', people: [{name: 'Bob'}]}
      const state = fromJS({investigation})
      expect(getInvestigationSelector(state)).toEqualImmutable(fromJS(investigation))
    })

    it('returns an empty map when investigation does not exist', () => {
      const state = Map()
      expect(getInvestigationSelector(state)).toEqualImmutable(Map())
    })
  })
})
