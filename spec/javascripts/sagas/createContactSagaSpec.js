import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createContactSaga,
  createContact,
} from 'sagas/createContactSaga'
import {
  createSuccess,
  createFailure,
  CREATE_CONTACT,
} from 'actions/contactActions'
import {push} from 'react-router-redux'

describe('createContactSaga', () => {
  it('creates contact on CREATE_CONTACT', () => {
    const gen = createContactSaga()
    expect(gen.next().value).toEqual(takeEvery(CREATE_CONTACT, createContact))
  })
})

describe('createContact', () => {
  it('creates and puts contact', () => {
    const contact = {investigation_id: '123'}
    const contactResponse = {id: '222'}
    const gen = createContact(contact)
    expect(gen.next().value).toEqual(
      call(post, '/api/v1/investigations/123/contacts', contact)
    )
    expect(gen.next(contactResponse).value).toEqual(
      put(createSuccess(contactResponse))
    )
    expect(gen.next().value).toEqual(
      put(push('/investigations/123/contacts/222'))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const contact = {investigation_id: '123'}
    const gen = createContact(contact)
    expect(gen.next().value).toEqual(
      call(post, '/api/v1/investigations/123/contacts', contact)
    )
    expect(gen.throw(error).value).toEqual(
      put(createFailure('some error'))
    )
  })
})
