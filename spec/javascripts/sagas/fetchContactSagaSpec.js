import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchContactSaga, fetchContact} from 'sagas/fetchContactSaga'
import {
  FETCH_CONTACT,
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
  it('fetches and puts the contact', () => {
    const id = '456'
    const investigationId = '123'
    const gen = fetchContact({investigation_id: investigationId, id})
    const contactResponse = {id: '456'}
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123/contacts/456')
    )
    expect(gen.next(contactResponse).value).toEqual(
      put(fetchSuccess(investigationId, contactResponse))
    )
  })

  it('puts errors when errors are thrown', () => {
    const id = '456'
    const investigationId = '123'
    const error = {responseJSON: 'some error'}
    const gen = fetchContact({investigation_id: investigationId, id})
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/123/contacts/456')
    )
    expect(gen.throw(error).value).toEqual(
      put(fetchFailure('some error'))
    )
  })
})
