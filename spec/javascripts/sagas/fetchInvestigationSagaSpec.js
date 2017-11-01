import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {loadInvestigation, fetchInvestigationSaga} from 'sagas/fetchInvestigationSaga'
import {
  FETCH_INVESTIGATION,
  fetch,
  fetchSuccess,
  fetchFailure,
} from 'actions/investigationActions'

describe('fetchInvestigationSaga', () => {
  it('loads the investigation on FETCH_INVESTIGATION', () => {
    const saga = fetchInvestigationSaga()
    expect(saga.next().value).toEqual(takeLatest(FETCH_INVESTIGATION, loadInvestigation))
  })
})

describe('loadInvestigation', () => {
  const id = '123'
  const action = fetch({id})

  it('puts investigation on success', () => {
    const investigation = {started_at: '01/02/03', people: [{first_name: 'Bob'}]}
    const saga = loadInvestigation(action)
    expect(saga.next().value).toEqual(call(get, '/api/v1/investigations/123'))
    expect(saga.next(investigation).value).toEqual(put(fetchSuccess(investigation)))
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const saga = loadInvestigation(action)
    expect(saga.next().value).toEqual(call(get, '/api/v1/investigations/123'))
    expect(saga.throw(error).value).toEqual(put(fetchFailure('some error')))
  })
})
