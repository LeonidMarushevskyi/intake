import {fromJS} from 'immutable'
import {
  getHistoryIsEmptySelector,
  getFormattedCasesSelector,
  getReferralsSelector,
  getReferralsCountSelector,
  getScreeningsSelector,
  getScreeningsCountSelector,
} from 'selectors/historyOfInvolvementSelectors'
import * as matchers from 'jasmine-immutable-matchers'

describe('historyOfInvolvementSelectors', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  const history_of_involvement = {cases: ['A'], referrals: ['B', 'C'], screenings: ['D', 'E', 'F']}

  describe('getHistoryIsEmptySelector', () => {
    it('returns true when history is not present', () => {
      const state = fromJS({investigation: {}})
      expect(getHistoryIsEmptySelector(state)).toEqual(true)
    })

    it('returns true when cases, referrals and screenings are empty', () => {
      const emptyHistory = {cases: [], referrals: [], screenings: []}
      const state = fromJS({investigation: {emptyHistory}})
      expect(getHistoryIsEmptySelector(state)).toEqual(true)
    })

    it('returns false when history items are present', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getHistoryIsEmptySelector(state)).toEqual(false)
    })
  })

  describe('getFormattedCasesSelector', () => {
    it('returns the legacy_ui_id as caseId', () => {
      const cases = [{legacy_descriptor: {legacy_ui_id: 'ABC123'}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'caseId'])).toEqual('ABC123')
    })

    it('returns the county_name as county', () => {
      const cases = [{county_name: 'Amador'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'county'])).toEqual('Amador')
    })

    it('returns the start_date and end_date as a formatted date range', () => {
      const cases = [{start_date: '2002-01-02', end_date: '2002-02-03'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'dateRange'])).toEqual('01/02/2002 - 02/03/2002')
    })

    it('returns the formatted name for the focus child', () => {
      const cases = [{focus_child: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'focusChild'])).toEqual('John Smith')
    })

    it('returns the formatted names for all parents present', () => {
      const cases = [{parents: [
        {first_name: 'John', last_name: 'Smith'},
        {first_name: 'Jane', last_name: 'Doe'},
      ]}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'parents'])).toEqual('John Smith, Jane Doe')
    })

    it('returns an empty string if no parents are present', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'parents'])).toEqual('')
    })

    it('returns Sealed if the access indicator is R', () => {
      const cases = [{access_limitation: {limited_access_code: 'R'}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'restrictedAccessStatus'])).toEqual('Sealed')
    })

    it('returns undefined if no access indicator is present', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'restrictedAccessStatus'])).toEqual(undefined)
    })
    it('returns a status of "Closed" if there is an end date, but no service component', () => {
      const cases = [{end_date: '2003-01-01'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Closed')
    })

    it('returns a status of "Open" if there is an end date present, but no service component', () => {
      const cases = [{}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Open')
    })

    it('adds the service component to the status if one exists', () => {
      const cases = [{end_date: '2003-01-01', service_component: 'Family reunification'}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'status'])).toEqual('Closed - Family reunification')
    })

    it('returns the formatted name for the worker', () => {
      const cases = [{assigned_social_worker: {first_name: 'John', last_name: 'Smith'}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'worker'])).toEqual('John Smith')
    })

    it('returns an empty string if no social worker is present', () => {
      const cases = [{assigned_social_worker: {}}]
      const state = fromJS({investigation: {history_of_involvement: {cases}}})
      expect(getFormattedCasesSelector(state).getIn([0, 'worker'])).toEqual('')
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getFormattedCasesSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getReferralsSelector', () => {
    it('returns the current history of involvement referrals', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getReferralsSelector(state)).toEqualImmutable(fromJS(['B', 'C']))
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getReferralsSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getReferralsCountSelector', () => {
    it('returns the number of current history of involvement referrals', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getReferralsCountSelector(state)).toEqual(2)
    })

    it('returns 0 when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getReferralsCountSelector(state)).toEqualImmutable(0)
    })
  })

  describe('getScreeningsSelector', () => {
    it('returns the current history of involvement cases', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getScreeningsSelector(state)).toEqualImmutable(fromJS(['D', 'E', 'F']))
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getScreeningsSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getScreeningsCountSelector', () => {
    it('returns the number of current history of involvement screenings', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getScreeningsCountSelector(state)).toEqual(3)
    })

    it('returns 0 when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getScreeningsCountSelector(state)).toEqualImmutable(0)
    })
  })
})

