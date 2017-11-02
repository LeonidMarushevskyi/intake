import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {buildContactSaga, buildContact} from 'sagas/buildContactSaga'
import {
  BUILD_CONTACT,
  build,
  buildSuccess,
  buildFailure,
} from 'actions/contactFormActions'

describe('buildContactSaga', () => {
  it('builds a contact on BUILD_CONTACT', () => {
    const saga = buildContactSaga()
    expect(saga.next().value).toEqual(takeEvery(BUILD_CONTACT, buildContact))
  })
})

describe('buildContact', () => {
  const action = build({investigation_id: '123ABC'})

  it('fetches the contacts investigation', () => {
    const gen = buildContact(action)
    const investigation = {id: '123ABC', started_at: 'date time', people: ['bob']}
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123ABC')
    )
    expect(gen.next(investigation).value).toEqual(
      put(
        buildSuccess({
          investigation_id: '123ABC',
          investigation_started_at: 'date time',
          investigation_people: ['bob'],
        })
      )
    )
  })

  it('puts BUILD_CONTACT_COMPLETE with errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = buildContact(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123ABC')
    )
    expect(gen.throw(error).value).toEqual(
      put(buildFailure('some error'))
    )
  })
})
