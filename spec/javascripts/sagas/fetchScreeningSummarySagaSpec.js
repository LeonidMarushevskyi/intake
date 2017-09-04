import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  loadScreeningSummary,
  fetchScreeningSummarySaga,
} from 'sagas/fetchScreeningSummarySaga'
import {
  FETCH_SCREENING_SUMMARY,
  fetchSuccess,
  fetchFailure,
} from 'actions/screeningSummaryActions'

describe('fetchScreeningSummarySaga', () => {
  it('loads screening summary on FETCH_SCREENING_SUMMARY', () => {
    const gen = fetchScreeningSummarySaga()
    expect(gen.next().value).toEqual(takeLatest(FETCH_SCREENING_SUMMARY, loadScreeningSummary))
  })
})

describe('loadScreeningSummary', () => {
  it('puts screening summary on success', () => {
    const id = '123'
    const screening = {id}
    const gen = loadScreeningSummary({id})
    expect(gen.next().value).toEqual(call(get, '/api/v1/investigations/123/screening'))
    expect(gen.next(screening).value).toEqual(
      put(fetchSuccess(screening))
    )
  })

  it('puts errors when errors are thrown', () => {
    const id = '123'
    const error = {responseJSON: 'some error'}
    const gen = loadScreeningSummary({id})
    expect(gen.next().value).toEqual(call(get, '/api/v1/investigations/123/screening'))
    expect(gen.throw(error).value).toEqual(
      put(fetchFailure('some error'))
    )
  })
})
