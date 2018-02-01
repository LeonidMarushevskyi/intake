import * as matchers from 'jasmine-immutable-matchers'
import involvementsReducer from 'reducers/involvementsReducer'
import {
  fetchHistoryOfInvolvementsSuccess,
  fetchHistoryOfInvolvementsFailure,
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {clearHistoryOfInvolvement} from 'actions/historyOfInvolvementActions'
import {fromJS, Map} from 'immutable'

describe('involvementsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE', () => {
    it('returns the involvements from the action on success', () => {
      const involvements = fromJS({cases: [], referrals: [], screenings: []})
      const action = fetchHistoryOfInvolvementsSuccess(involvements.toJS())
      expect(involvementsReducer(Map(), action)).toEqualImmutable(involvements)
    })
    it('returns the last state on failure', () => {
      const action = fetchHistoryOfInvolvementsFailure()
      expect(involvementsReducer(Map(), action))
        .toEqualImmutable(Map())
    })
  })

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns an empty map', () => {
      const action = createScreeningSuccess({})
      const oldState = fromJS({cases: [], referrals: [], screenings: []})
      expect(involvementsReducer(oldState, action)).toEqual(Map())
    })
    it('returns last state on failure', () => {
      const action = createScreeningFailure({})
      const oldState = fromJS({cases: [], screenings: [], referrals: []})
      expect(involvementsReducer(oldState, action)).toEqual(oldState)
    })
  })

  describe('on CLEAR_HISTORY_OF_INVOLVEMENTS', () => {
    it('clears all the history from the involvements reducer', () => {
      const oldState = fromJS({cases: [], referrals: [], screenings: []})
      const action = clearHistoryOfInvolvement()
      expect(involvementsReducer(oldState, action)).toEqual(Map())
    })
  })
})
