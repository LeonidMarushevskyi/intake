import * as matchers from 'jasmine-immutable-matchers'
import {fetchSuccess} from 'actions/screeningSummaryActions'
import screeningSummaryReducer from 'reducers/screeningSummaryReducer'
import {Map, fromJS} from 'immutable'

describe('screeningSummaryReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))
  describe('on FETCH_SCREENING_SUMMARY_SUCCESS', () => {
    it('returns the screening summary from the action', () => {
      const screeningSummary = fromJS({id: '1'})
      const action = fetchSuccess(screeningSummary.toJS())
      expect(screeningSummaryReducer(Map(), action)).toEqualImmutable(screeningSummary)
    })
  })
})
