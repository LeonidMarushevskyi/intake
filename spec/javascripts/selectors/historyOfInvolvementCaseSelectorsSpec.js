import {fromJS, List, Map} from 'immutable'
import {
  getCasesSelector,
  getCaseAtIndexSelector,
  getFormattedParentNamesSelector,
  getRestrictedAccessStatusSelector,
  getStatusAndServiceComponentStringSelector,
} from 'selectors/historyOfInvolvementCaseSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('historyOfInvolvementCaseSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('getCasesSelector', () => {
    it('returns the screenings when present', () => {
      const cases = [{id: 1}, {id: 2}, {id: 3}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getCasesSelector(state, 1)).toEqualImmutable(fromJS(cases))
    })

    it('returns an empty List when there are no screenings', () => {
      const state = fromJS({investigation: {history_of_involvement: {referrals: []}}})
      expect(getCasesSelector(state, 1)).toEqualImmutable(List())
    })
  })

  describe('getCaseAtIndexSelector', () => {
    it('returns the screening at the passed index when present', () => {
      const cases = [{id: 1}, {id: 2}, {id: 3}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getCaseAtIndexSelector(state, 1)).toEqualImmutable(Map({id: 2}))
    })

    it('returns an empty Map when there is no item at the passed index', () => {
      const cases = [{id: 1}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getCaseAtIndexSelector(state, 1)).toEqualImmutable(Map())
    })
  })

  describe('getFormattedParentNamesSelector', () => {
    it('returns the formatted names for all parents present', () => {
      const cases = [{parents: [
        {first_name: 'John', last_name: 'Smith'},
        {first_name: 'Jane', last_name: 'Doe'},
      ]}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedParentNamesSelector(state, 0)).toEqual('John Smith, Jane Doe')
    })

    it('returns an empty string if no parents are present', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedParentNamesSelector(state, 0)).toEqual('')
    })
  })

  describe('getRestrictedAccessStatusSelector', () => {
    it('returns Sealed if the access indicator is R', () => {
      const cases = [{access_limitation: {limited_access_code: 'R'}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getRestrictedAccessStatusSelector(state, 0)).toEqual('Sealed')
    })

    it('returns undefined if no access indicator is present', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getRestrictedAccessStatusSelector(state, 0)).toEqual(undefined)
    })
  })

  describe('getStatusAndServiceComponentStringSelector', () => {
    it('returns "Closed" if there is an end date, but no service component', () => {
      const cases = [{end_date: '2003-01-01'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getStatusAndServiceComponentStringSelector(state, 0)).toEqual('Closed')
    })

    it('returns "Open" if there is an end date present, but no service component', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getStatusAndServiceComponentStringSelector(state, 0)).toEqual('Open')
    })

    it('returns adds the service component to the status if one exists', () => {
      const cases = [{end_date: '2003-01-01', service_component: 'Family reunification'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getStatusAndServiceComponentStringSelector(state, 0)).toEqual('Closed - Family reunification')
    })
  })
})
