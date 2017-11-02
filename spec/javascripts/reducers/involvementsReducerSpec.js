import * as matchers from 'jasmine-immutable-matchers'
import involvementsReducer from 'reducers/involvementsReducer'
import {
  fetchHistoryOfInvolvementsSuccess,
  fetchHistoryOfInvolvementsFailure,
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('involvementsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_HISTORY_OF_INVOLVEMENTS_COMPLETE', () => {
    it('returns the involvements from the action on success', () => {
      const involvements = fromJS([{id: 1}, {id: 2}])
      const action = fetchHistoryOfInvolvementsSuccess(involvements.toJS())
      expect(involvementsReducer(List(), action)).toEqualImmutable(involvements)
    })
    it('returns the last state on failure', () => {
      const action = fetchHistoryOfInvolvementsFailure()
      expect(involvementsReducer(List(), action))
        .toEqualImmutable(List())
    })
  })

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns an empty immutable list', () => {
      const action = createScreeningSuccess({})
      const oldState = fromJS([{id: 1}])
      expect(involvementsReducer(oldState, action).isEmpty()).toEqual(true)
    })
    it('returns last state on failure', () => {
      const action = createScreeningFailure({})
      const oldState = fromJS([{id: 1}])
      expect(involvementsReducer(oldState, action)).toEqual(oldState)
    })
  })
})
