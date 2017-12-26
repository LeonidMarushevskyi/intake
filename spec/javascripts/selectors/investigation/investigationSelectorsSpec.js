import {fromJS, Map} from 'immutable'
import {
  getInvestigationIdValueSelector,
  getInvestigationNameValueSelector,
  getInvestigationSelector,
  getInvestigationTitleSelector,
} from 'selectors/investigation/investigationSelectors'
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

  describe('getInvestigationIdValueSelector', () => {
    it('returns the id for the screening currently in the store', () => {
      const state = fromJS({investigation: {id: '123ABC'}})
      expect(getInvestigationIdValueSelector(state)).toEqual('123ABC')
    })
  })

  describe('getInvestigationNameValueSelector', () => {
    it('returns the screening name for the investigation currently in the store', () => {
      const state = fromJS({investigation: {screening_summary: {name: 'the addams family'}}})
      expect(getInvestigationNameValueSelector(state)).toEqual('the addams family')
    })
  })

  describe('getInvestigationTitleSelector', () => {
    it('returns the screening name if investigation has a name', () => {
      const state = fromJS({investigation: {id: 1, screening_summary: {name: 'the addams family'}}})
      expect(getInvestigationTitleSelector(state)).toEqual('the addams family')
    })

    it('returns the screening id if screening does not have a name', () => {
      const state = fromJS({investigation: {id: 1}})
      expect(getInvestigationTitleSelector(state)).toEqual('Investigation 1')
    })
  })
})
