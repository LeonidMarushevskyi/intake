import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningSaga, fetchScreening} from 'sagas/fetchScreeningSaga'
import {FETCH_SCREENING} from 'actions/actionTypes'
import {
  fetchScreeningSuccess,
  fetchScreeningFailure,
} from 'actions/screeningActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'

describe('fetchScreeningSaga', () => {
  it('fetches screening on FETCH_SCREENING', () => {
    const gen = fetchScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENING, fetchScreening))
  })
})

describe('fetchScreening', () => {
  describe('when successful', () => {
    it('fetches and puts screening with cross report data', () => {
      const id = '123'
      const screening = {id, cross_reports: [{county_id: '1234'}]}
      const gen = fetchScreening({id})
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(gen.next(screening).value).toEqual(put(fetchCountyAgencies('1234')))
      expect(gen.next(screening).value).toEqual(
        put(fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without county info data', () => {
      const id = '123'
      const screening = {id, cross_reports: [{county_id: ''}]}
      const gen = fetchScreening({id})
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(gen.next(screening).value).toEqual(
        put(fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without a cross report', () => {
      const id = '123'
      const screening = {id, cross_reports: []}
      const gen = fetchScreening({id})
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(gen.next(screening).value).toEqual(
        put(fetchScreeningSuccess(screening))
      )
    })
    it('fetches and puts screening without cross report key', () => {
      const id = '123'
      const screening = {id}
      const gen = fetchScreening({id})
      expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
      expect(gen.next(screening).value).toEqual(
        put(fetchScreeningSuccess(screening))
      )
    })
  })
  it('puts errors when errors are thrown', () => {
    const id = '123'
    const error = {responseJSON: 'some error'}
    const gen = fetchScreening({id})
    expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
    expect(gen.throw(error).value).toEqual(
      put(fetchScreeningFailure('some error'))
    )
  })
})
