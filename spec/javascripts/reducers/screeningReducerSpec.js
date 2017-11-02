import * as matchers from 'jasmine-immutable-matchers'
import {
  createScreeningSuccess,
  createScreeningFailure,
  fetchScreeningSuccess,
  fetchScreeningFailure,
  submitScreeningSuccess,
  submitScreeningFailure,
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

  describe('on CREATE_SCREENING_COMPLETE', () => {
    it('returns the screening from the action on success', () => {
      const screening = {id: '1'}
      const action = createScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
    it('returns the last state on failure', () => {
      const action = createScreeningFailure()
      expect(screeningReducer(Map(), action)).toEqualImmutable(Map())
    })
  })

  describe('on FETCH_SCREENING_COMPLETE', () => {
    it('returns the screening from the action on success', () => {
      const screening = {id: '1'}
      const action = fetchScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
    it('returns the last state on failure', () => {
      const action = fetchScreeningFailure()
      expect(screeningReducer(Map(), action)).toEqualImmutable(Map())
    })
  })

  describe('on UPDATE_SCREENING_COMPLETE', () => {
    it('returns the screening from the action on success', () => {
      const screening = {id: '1'}
      const action = updateScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
  })

  describe('on SUBMIT_SCREENING_COMPLETE', () => {
    it('returns the screening from the action on success', () => {
      const screening = {id: '1'}
      const action = submitScreeningSuccess(screening)
      expect(screeningReducer(Map(), action)).toEqualImmutable(
        Map({id: '1', fetch_status: 'FETCHED'})
      )
    })
    it('returns the last state on failure', () => {
      const action = submitScreeningFailure()
      expect(screeningReducer(Map(), action)).toEqualImmutable(Map())
    })
  })
})
