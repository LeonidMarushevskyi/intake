import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {loadInvestigationPeople, fetchInvestigationPeopleSaga} from 'sagas/fetchInvestigationPeopleSaga'
import {FETCH_INVESTIGATION_PEOPLE, fetchSuccess, fetchFailure} from 'actions/investigationPeopleActions'

describe('fetchInvestigationPeopleSaga', () => {
  it('loads people from the investigation on FETCH_INVESTIGATION_PEOPLE', () => {
    const saga = fetchInvestigationPeopleSaga()
    expect(saga.next().value).toEqual(takeLatest(FETCH_INVESTIGATION_PEOPLE, loadInvestigationPeople))
  })
})

describe('loadInvestigationPeople', () => {
  it('puts investigation people on success', () => {
    const investigationId = '123'
    const people = [{first_name: 'Bob'}]
    const saga = loadInvestigationPeople({investigationId})
    expect(saga.next().value).toEqual(call(get, '/api/v1/investigations/123/people'))
    expect(saga.next(people).value).toEqual(put(fetchSuccess(people)))
  })

  it('puts errors when errors are thrown', () => {
    const investigationId = '123'
    const error = {responseJSON: 'some error'}
    const saga = loadInvestigationPeople({investigationId})
    expect(saga.next().value).toEqual(call(get, '/api/v1/investigations/123/people'))
    expect(saga.throw(error).value).toEqual(put(fetchFailure('some error')))
  })
})
