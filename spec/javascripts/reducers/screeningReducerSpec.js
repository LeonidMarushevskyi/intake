import * as screeningActions from 'actions/screeningActions'
import screeningReducer from 'reducers/screeningReducer'
import Immutable from 'immutable'

describe('screeningReducer', () => {
  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = screeningActions.createScreeningSuccess(screening)
      expect(screeningReducer(Immutable.Map(), action).toJS()).toEqual(screening)
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = screeningActions.fetchScreeningSuccess(screening)
      expect(screeningReducer(Immutable.Map(), action).toJS()).toEqual(screening)
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = screeningActions.updateScreeningSuccess(screening)
      expect(screeningReducer(Immutable.Map(), action).toJS()).toEqual(screening)
    })
  })
})
