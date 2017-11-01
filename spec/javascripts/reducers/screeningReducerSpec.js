import * as matchers from 'jasmine-immutable-matchers'
import {
  createScreeningSuccess,
  fetchScreeningSuccess,
  submitScreeningSuccess,
  updateScreeningSuccess,
} from 'actions/screeningActions'
import {FETCH_SCREENING} from 'actions/actionTypes'
import screeningReducer from 'reducers/screeningReducer'
import {Map} from 'immutable'

describe('screeningReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on FETCH_SCREENING', () => {
    it('returns the screening from the action', () => {
      const action = {type: FETCH_SCREENING}
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({fetch_status: 'FETCHING'})
      )
    })
  })

  describe('on CREATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1'}
      const action = createScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
  })

  describe('on FETCH_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1'}
      const action = fetchScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
  })

  describe('on UPDATE_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1'}
      const action = updateScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
  })

  describe('on SUBMIT_SCREENING_SUCCESS', () => {
    it('returns the screening from the action', () => {
      const screening = {id: '1'}
      const action = submitScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
  })
})
