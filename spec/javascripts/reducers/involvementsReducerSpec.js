import * as matchers from 'jasmine-immutable-matchers'
import involvementsReducer from 'reducers/involvementsReducer'
import {
  fetchHistoryOfInvolvementsSuccess,
  createScreeningSuccess,
} from 'actions/screeningActions'
import {List, fromJS} from 'immutable'

describe('involvementsReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_HISTORY_OF_INVOLVEMENTS_SUCCESS', () => {
    it('returns the involvements from the action', () => {
      const involvements = fromJS([{id: 1}, {id: 2}])
      const action = fetchHistoryOfInvolvementsSuccess(involvements.toJS())
      expect(involvementsReducer(List(), action)).toEqualImmutable(involvements)
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns an empty immutable list', () => {
      const action = createScreeningSuccess({})
      const oldState = fromJS([{id: 1}])
      expect(involvementsReducer(oldState, action).isEmpty()).toEqual(true)
    })
  })
})
