import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {buildContactSaga, buildContact} from 'sagas/buildContactSaga'
import {BUILD_CONTACT, buildSuccess, buildFailure} from 'actions/contactFormActions'
import {fetchSuccess} from 'actions/investigationActions'

describe('buildContactSaga', () => {
  it('builds a contact on BUILD_CONTACT', () => {
    const saga = buildContactSaga()
    expect(saga.next().value).toEqual(takeEvery(BUILD_CONTACT, buildContact))
  })
})

describe('buildContact', () => {
  it('fetches the contacts investigation', () => {
    const gen = buildContact({investigation_id: '123ABC'})
    const investigation = {id: '123ABC', started_at: 'date time'}
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123ABC')
    )
    expect(gen.next(investigation).value).toEqual(
      put(fetchSuccess(investigation))
    )
    expect(gen.next(investigation).value).toEqual(
      put(buildSuccess({investigation_id: '123ABC', investigation_started_at: 'date time'}))
    )
  })

  it('dispatches BUILD_CONTACT_FAILURE when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = buildContact({investigation_id: '123ABC'})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123ABC')
    )
    expect(gen.throw(error).value).toEqual(
      put(buildFailure('some error'))
    )
  })
})
