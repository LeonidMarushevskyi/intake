import {List, fromJS, Seq} from 'immutable'
import {
  getErrorsSelector,
  getReportNarrativeValueSelector,
  getScreeningWithEditsSelector,
  getTouchedFieldsSelector,
  getVisibleErrorsSelector,
} from 'selectors/narrativeFormSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('narrativeFormSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getReportNarrativeValue', () => {
    it('returns a value when one is present', () => {
      const narrativeForm = {report_narrative: {value: 'ABC'}}
      const state = fromJS({narrativeForm})
      expect(getReportNarrativeValueSelector(state)).toEqual('ABC')
    })

    it('returns undefined when one report narrative is not present', () => {
      const narrativeForm = {}
      const state = fromJS({narrativeForm})
      expect(getReportNarrativeValueSelector(state)).toEqual(undefined)
    })
  })

  describe('getScreeningWithEditsSelector', () => {
    it('returns a screening with an updated report_narrative if the form has a value', () => {
      const screening = {report_narrative: 'ABC'}
      const narrativeForm = {report_narrative: {value: '123', touched: true}}
      const state = fromJS({screening, narrativeForm})
      expect(getScreeningWithEditsSelector(state))
        .toEqualImmutable(fromJS({report_narrative: '123'}))
    })
  })

  describe('getErrorsSelector', () => {
    it('returns an error if narrative is empty', () => {
      const narrativeForm = {report_narrative: {value: ''}}
      const state = fromJS({narrativeForm})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List(['Please enter a narrative.']))
    })

    it('returns an error if narrative contains only whitespace', () => {
      const narrativeForm = {report_narrative: {value: '   '}}
      const state = fromJS({narrativeForm})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List(['Please enter a narrative.']))
    })

    it('returns no errors if narrative is present', () => {
      const narrativeForm = {report_narrative: {value: 'ABC'}}
      const state = fromJS({narrativeForm})
      expect(getErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List([]))
    })
  })

  describe('getTouchedFieldsSelector', () => {
    it('returns the contactForm field names that are touched', () => {
      const narrativeForm = {
        fieldA: {touched: false},
        fieldB: {touched: true},
        fieldC: {},
        fieldD: {touched: true},
      }
      const state = fromJS({narrativeForm})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq(['fieldB', 'fieldD']))
    })

    it('returns empty list when no contact', () => {
      const narrativeForm = {}
      const state = fromJS({narrativeForm})
      expect(getTouchedFieldsSelector(state)).toEqualImmutable(Seq())
    })
  })

  describe('getVisibleErrorsSelector', () => {
    it('returns an error if the field has a validation and is touched', () => {
      const narrativeForm = {
        report_narrative: {
          value: undefined,
          touched: true,
        },
      }
      const state = fromJS({narrativeForm})
      expect(getVisibleErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List(['Please enter a narrative.']))
    })

    it('does not return an error if the field has not been touched', () => {
      const narrativeForm = {
        report_narrative: {
          value: undefined,
          touched: false,
        },
      }
      const state = fromJS({narrativeForm})
      expect(getVisibleErrorsSelector(state).get('report_narrative'))
        .toEqualImmutable(List())
    })
  })
})
