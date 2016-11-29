import * as screeningActions from 'actions/screeningActions'
import screeningReducer from 'reducers/screeningReducer'
import Immutable from 'immutable'

describe('screeningReducer', () => {
  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = Immutable.Map({id: 1, name: 'mock_screening'})
      const action = screeningActions.fetchScreeningSuccess(screening)
      expect(screeningReducer(Immutable.Map(), action)).toEqual(screening)
    })
  })
})
