import {SUBMIT_SCREENING_SUCCESS} from 'actions/actionTypes'
import {
  createScreeningSuccess,
  fetchScreeningSuccess,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import screeningReducer from 'reducers/screeningReducer'
import {Map} from 'immutable'

describe('screeningReducer', () => {
  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = createScreeningSuccess(screening)
      expect(screeningReducer(Map(), action).toJS()).toEqual(screening)
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = fetchScreeningSuccess(screening)
      expect(screeningReducer(Map(), action).toJS()).toEqual(screening)
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = updateScreeningSuccess(screening)
      expect(screeningReducer(Map(), action).toJS()).toEqual(screening)
    })
  })

  describe('on SUBMIT_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1', name: 'mock_screening'}
      const action = {
        type: SUBMIT_SCREENING_SUCCESS,
        screening: screening,
      }
      expect(screeningReducer(Map(), action)).toEqual(screening)
    })
  })
})
