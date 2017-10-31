import 'babel-polyfill'
import {takeEvery, put, call} from 'redux-saga/effects'
import * as api from 'utils/http'
import {
  saveContactSaga,
  saveContact,
} from 'sagas/saveContactSaga'
import {
  save,
  saveSuccess,
  saveFailure,
  SAVE_CONTACT,
} from 'actions/contactActions'
import {push} from 'react-router-redux'

describe('saveContactSaga', () => {
  it('creates contact on SAVE_CONTACT', () => {
    const gen = saveContactSaga()
    expect(gen.next().value).toEqual(takeEvery(SAVE_CONTACT, saveContact))
  })
})

describe('saveContact', () => {
  const contactResponse = {legacy_descriptor: {legacy_id: 'existing_contact_id'}}

  describe('when id is present', () => {
    const action = save({
      investigation_id: 'existing_investigation_id',
      id: 'existing_contact_id',
    })

    it('calls update API and puts saveSuccess action', () => {
      const gen = saveContact(action)
      expect(gen.next().value).toEqual(
        call(
          api.put,
          '/api/v1/investigations/existing_investigation_id/contacts/existing_contact_id',
          {
            investigation_id: 'existing_investigation_id',
            id: 'existing_contact_id',
            started_at: undefined,
            status: undefined,
            note: undefined,
            purpose: undefined,
            communication_method: undefined,
            location: undefined,
            people: undefined,
          }
        )
      )
      expect(gen.next(contactResponse).value).toEqual(put(saveSuccess(contactResponse)))
      expect(gen.next().value).toEqual(
        put(
          push(
            '/investigations/existing_investigation_id/contacts/existing_contact_id'
          )
        )
      )
    })
  })
  describe('when id is not present', () => {
    const action = save({
      investigation_id: 'existing_investigation_id',
      id: null,
    })

    it('calls create API and puts saveSuccess action', () => {
      const gen = saveContact(action)
      expect(gen.next().value).toEqual(
        call(
          api.post,
          '/api/v1/investigations/existing_investigation_id/contacts',
          {
            investigation_id: 'existing_investigation_id',
            id: null,
            started_at: undefined,
            status: undefined,
            note: undefined,
            purpose: undefined,
            communication_method: undefined,
            location: undefined,
            people: undefined,
          }
        )
      )
      expect(gen.next(contactResponse).value).toEqual(
        put(saveSuccess(contactResponse))
      )
      expect(gen.next().value).toEqual(
        put(
          push('/investigations/existing_investigation_id/contacts/existing_contact_id')
        )
      )
    })
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const action = save({investigation_id: 'existing_investigation_id'})
    const gen = saveContact(action)
    expect(gen.next().value).toEqual(
      call(
        api.post,
        '/api/v1/investigations/existing_investigation_id/contacts',
        {
          investigation_id: 'existing_investigation_id',
          id: undefined,
          started_at: undefined,
          status: undefined,
          note: undefined,
          purpose: undefined,
          communication_method: undefined,
          location: undefined,
          people: undefined,
        }
      )
    )
    expect(gen.throw(error).value).toEqual(
      put(saveFailure('some error'))
    )
  })
})
