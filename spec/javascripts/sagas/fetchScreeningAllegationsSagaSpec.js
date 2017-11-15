import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningAllegationsSaga, fetchAllegations} from 'sagas/fetchScreeningAllegationsSaga'
import {FETCH_SCREENING_ALLEGATIONS, fetchSuccess, fetchFailure} from 'actions/screeningAllegationsActions'

describe('fetchScreeningAllegationsSaga', () => {
  it('fetches screening allegations on FETCH_SCREENING_ALLEGATIONS', () => {
    const gen = fetchScreeningAllegationsSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENING_ALLEGATIONS, fetchAllegations))
  })
})

describe('fetchScreenings', () => {
  it('fetches and puts screening allegations', () => {
    const screeningId = 'ABC'
    const saga = fetchAllegations({payload: {screeningId}})
    expect(saga.next().value).toEqual(call(get, '/api/v1/screenings/ABC'))
    const screening = {allegations: [{id: 1}]}
    expect(saga.next(screening).value).toEqual(put(fetchSuccess([{id: 1}])))
  })

  it('puts errors when errors are thrown', () => {
    const screeningId = 'ABC'
    const saga = fetchAllegations({payload: {screeningId}})
    expect(saga.next().value).toEqual(call(get, '/api/v1/screenings/ABC'))
    const error = {responseJSON: 'some error'}
    expect(saga.throw(error).value).toEqual(put(fetchFailure('some error')))
  })
})

