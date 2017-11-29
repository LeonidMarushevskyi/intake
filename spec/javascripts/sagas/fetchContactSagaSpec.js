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
import {replace} from 'react-router-redux'

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

  describe('when unsuccessful', () => {
    it('puts errors', () => {
      const saga = fetchContact(action)
      const error = {responseJSON: 'some error'}
      expect(saga.next().value).toEqual(
        call(get, '/api/v1/investigations/123/contacts/456')
      )
      expect(saga.throw(error).value).toEqual(
        put(fetchFailure('some error'))
      )
    })

    it('redirects to not found page if error is 404', () => {
      const saga = fetchContact(action)
      const error = {responseJSON: 'notFound', status: 404}
      expect(saga.next().value).toEqual(
        call(get, '/api/v1/investigations/123/contacts/456')
      )
      expect(saga.throw(error).value).toEqual(put(replace('/notFound')))
    })
  })
})
