import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchContactSaga, fetchContact} from 'sagas/fetchContactSaga'
import {
  FETCH_CONTACT,
  fetch,
  fetchSuccess,
  fetchFailure,
} from 'actions/contactActions'

describe('fetchContactSaga', () => {
  it('creates contact on FETCH_CONTACT', () => {
    const gen = fetchContactSaga()
    expect(gen.next().value).toEqual(takeEvery(FETCH_CONTACT, fetchContact))
  })
})

describe('fetchContact', () => {
  const id = '456'
  const investigationId = '123'
  const contactResponse = {id}
  const action = fetch(investigationId, id)

  it('fetches and puts the contact', () => {
    const gen = fetchContact(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123/contacts/456')
    )
    expect(gen.next(contactResponse).value).toEqual(
      put(fetchSuccess(investigationId, contactResponse))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = fetchContact(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123/contacts/456')
    )
    expect(gen.throw(error).value).toEqual(
      put(fetchFailure('some error'))
    )
  })
})
