import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningSaga, fetchScreening} from 'sagas/fetchScreeningSaga'
import {FETCH_SCREENING} from 'actions/actionTypes'
import * as actions from 'actions/screeningActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {replace} from 'react-router-redux'

describe('fetchScreeningSaga', () => {
  it('fetches screening on FETCH_SCREENING', () => {
    const gen = fetchScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENING, fetchScreening))
  })
})

describe('fetchScreening', () => {
  const id = '123'
  const action = actions.fetchScreening(id)
  describe('when successful', () => {
    it('fetches and puts screening with cross report data', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: [{county_id: '1234'}]}
      expect(gen.next(screening).value).toEqual(put(fetchCountyAgencies('1234')))
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without county info data', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: [{county_id: ''}]}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without a cross report', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id, cross_reports: []}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without cross report key', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const screening = {id}
      expect(gen.next(screening).value).toEqual(
        put(actions.fetchScreeningSuccess(screening))
      )
    })
  })
  describe('when unsuccessful', () => {
    it('returns the error', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const error = {responseJSON: 'some error'}
      expect(gen.throw(error).value).toEqual(
        put(actions.fetchScreeningFailure('some error'))
      )
    })

    it('redirects to unauthorized page if error is 401', () => {
      const gen = fetchScreening(action)
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      const error = {responseJSON: 'forbidden', status: 401}
      expect(gen.throw(error).value).toEqual(put(replace('/unauthorized')))
    })
  })
})
