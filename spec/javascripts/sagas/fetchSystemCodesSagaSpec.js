import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchSystemCodesSaga, fetchSystemCodes} from 'sagas/fetchSystemCodesSaga'
import {FETCH_SYSTEM_CODES, fetchSuccess, fetchFailure} from 'actions/systemCodesActions'

describe('fetchSystemCodesSaga', () => {
  it('fetches system codes on FETCH_SYSTEM_CODES', () => {
    const gen = fetchSystemCodesSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_SYSTEM_CODES, fetchSystemCodes))
  })
})

describe('fetchSystemCodes', () => {
  it('fetches and puts system codes', () => {
    const systemCodes = [{code: '123', value: 'abc'}]
    const gen = fetchSystemCodes()
    expect(gen.next().value).toEqual(call(get, '/api/v1/system_codes'))
    expect(gen.next(systemCodes).value).toEqual(put(fetchSuccess(systemCodes)))
  })

  it('puts errors when errors are thrown', () => {
    const error = 'some error'
    const gen = fetchSystemCodes()
    expect(gen.next().value).toEqual(call(get, '/api/v1/system_codes'))
    expect(gen.throw(error).value).toEqual(put(fetchFailure('some error')))
  })
})
