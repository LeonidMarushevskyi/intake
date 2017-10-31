import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchCountyAgenciesSaga, fetchCountyAgencies} from 'sagas/fetchCountyAgenciesSaga'
import {FETCH_COUNTY_AGENCIES, fetch, fetchSuccess, fetchFailure} from 'actions/countyAgenciesActions'

describe('fetchCountyAgenciesSaga', () => {
  it('fetches county agencies on FETCH_COUNTY_AGENCIES', () => {
    const gen = fetchCountyAgenciesSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_COUNTY_AGENCIES, fetchCountyAgencies))
  })
})

describe('fetchCountyAgencies', () => {
  const countyId = '123'
  const action = fetch(countyId)

  it('fetches and puts countyAgencies', () => {
    const gen = fetchCountyAgencies(action)
    expect(gen.next().value).toEqual(call(get, '/api/v1/cross_report_agency/123'))
    const json = [{stuff: 123}]
    expect(gen.next(json).value).toEqual(
      put(fetchSuccess(json))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = 'some error'
    const gen = fetchCountyAgencies(action)
    expect(gen.next().value).toEqual(call(get, '/api/v1/cross_report_agency/123'))
    expect(gen.throw(error).value).toEqual(
      put(fetchFailure('some error'))
    )
  })
})
