import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningsSaga, fetchScreenings} from 'sagas/fetchScreeningsSaga'
import {FETCH_SCREENINGS, fetchSuccess, fetchFailure} from 'actions/screeningsActions'

describe('fetchScreeningsSaga', () => {
  it('fetches screenings on FETCH_SCREENINGS', () => {
    const gen = fetchScreeningsSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENINGS, fetchScreenings))
  })
})

describe('fetchScreenings', () => {
  it('fetches and puts screenings', () => {
    const screenings = [{id: 1}, {id: 2}]
    const gen = fetchScreenings()
    expect(gen.next().value).toEqual(call(get, '/api/v1/screenings'))
    expect(gen.next(screenings).value).toEqual(put(fetchSuccess(screenings)))
  })

  it('puts errors when errors are thrown', () => {
    const error = 'some error'
    const gen = fetchScreenings()
    expect(gen.next().value).toEqual(call(get, '/api/v1/screenings'))
    expect(gen.throw(error).value).toEqual(put(fetchFailure('some error')))
  })
})
