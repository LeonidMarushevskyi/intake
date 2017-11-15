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
import {
  fetchSuccess as fetchAllegationsSuccess,
  fetchFailure as fetchAllegationsFailure,
} from 'actions/screeningAllegationsActions'
import {FETCH_SCREENING} from 'actions/actionTypes'
import screeningReducer from 'reducers/screeningReducer'
import {Map, fromJS} from 'immutable'

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

  describe('on FETCH_SCREENING_ALLEGATIONS_COMPLETE', () => {
    it('returns the screening with updated allegations on success', () => {
      const screening = {id: 1, screening_decision: 'promote_to_referral', allegations: [{id: 1}]}
      const allegations = [{id: 2}]
      const action = fetchAllegationsSuccess(allegations)
      expect(screeningReducer(fromJS(screening), action)).toEqualImmutable(fromJS({
        id: 1,
        screening_decision: 'promote_to_referral',
        allegations: [{id: 2}],
      }))
    })

    it('returns the last state on failure', () => {
      const action = fetchAllegationsFailure()
      expect(screeningReducer(Map(), action)).toEqualImmutable(Map())
    })
  })
})
