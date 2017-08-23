import {SUBMIT_SCREENING_SUCCESS} from 'actions/actionTypes'
import {
  createScreeningSuccess,
  fetchScreeningSuccess,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import screeningReducer from 'reducers/screeningReducer'
import {Map, fromJS} from 'immutable'

describe('screeningReducer', () => {
  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = fromJS({id: '1'})
      const action = createScreeningSuccess(screening.toJS())
      expect(screeningReducer(Map(), action).equals(screening)).toEqual(true)
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = fromJS({id: '1'})
      const action = fetchScreeningSuccess(screening.toJS())
      expect(screeningReducer(Map(), action).equals(screening)).toEqual(true)
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = fromJS({id: '1'})
      const action = updateScreeningSuccess(screening.toJS())
      expect(screeningReducer(Map(), action).equals(screening)).toEqual(true)
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
