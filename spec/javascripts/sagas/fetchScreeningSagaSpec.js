import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchScreeningSaga, fetchScreening} from 'sagas/fetchScreeningSaga'
import {FETCH_SCREENING} from 'actions/actionTypes'
import {
  fetchScreeningSuccess,
  fetchScreeningFailure,
} from 'actions/screeningActions'

describe('fetchScreeningSaga', () => {
  it('fetches screening on FETCH_SCREENING', () => {
    const gen = fetchScreeningSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SCREENING, fetchScreening))
  })
})

describe('fetchScreening', () => {
  it('fetches and puts screening', () => {
    const id = '123'
    const screening = {id}
    const gen = fetchScreening({id})
    expect(gen.next().value).toEqual(call(get, '/api/v1/screenings/123'))
    expect(gen.next(screening).value).toEqual(
      put(fetchScreeningSuccess(screening))
    )
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
