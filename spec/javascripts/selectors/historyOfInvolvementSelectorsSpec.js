import {fromJS} from 'immutable'
import {
  getHistoryIsEmptySelector,
  getCasesSelector,
  getCasesCountSelector,
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

  describe('getCasesSelector', () => {
    it('returns the current history of involvement cases', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getCasesSelector(state)).toEqualImmutable(fromJS(['A']))
    })

    it('returns an empty map when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getCasesSelector(state)).toEqualImmutable(fromJS([]))
    })
  })

  describe('getCasesCountSelector', () => {
    it('returns the number of current history of involvement cases', () => {
      const state = fromJS({investigation: {history_of_involvement}})
      expect(getCasesCountSelector(state)).toEqual(1)
    })

    it('returns 0 when history of involvement does not exist', () => {
      const state = fromJS({investigation: {}})
      expect(getCasesCountSelector(state)).toEqualImmutable(0)
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

