import {List, fromJS} from 'immutable'
import {
  getErrorsSelector,
  getReportNarrativeValueSelector,
} from 'selectors/narrativeShowSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('contactFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getReportNarrativeValueSelector', () => {
    it('returns a value when one is present', () => {
      const screening = {report_narrative: 'ABC'}
      const state = fromJS({screening})
      expect(getReportNarrativeValueSelector(state)).toEqual('ABC')
    })

    it('returns undefined when one report narrative is not present', () => {
      const screening = {}
      const state = fromJS({screening})
      expect(getReportNarrativeValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getErrorsSelector', () => {
    it('returns an error if narrative is empty', () => {
      const screening = {report_narrative: ''}
      const state = fromJS({screening})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List(['Please enter a narrative.']))
    })

    it('returns an error if narrative contains only whitespace', () => {
      const screening = {report_narrative: '   '}
      const state = fromJS({screening})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List(['Please enter a narrative.']))
    })

    it('returns no errors if narrative is present', () => {
      const screening = {report_narrative: 'ABC'}
      const state = fromJS({screening})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List([]))
    })
  })
})
