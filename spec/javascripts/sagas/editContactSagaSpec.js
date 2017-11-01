import 'babel-polyfill'
import {takeEvery, call, put} from 'redux-saga/effects'
import {get} from 'utils/http'
import {editContactSaga, editContact} from 'sagas/editContactSaga'
import {
  EDIT_CONTACT,
  edit,
  editSuccess,
  editFailure,
} from 'actions/contactFormActions'

describe('editContactSaga', () => {
  it('calls editContact on EDIT_CONTACT', () => {
    const saga = editContactSaga()
    expect(saga.next().value).toEqual(takeEvery(EDIT_CONTACT, editContact))
  })
})

describe('editContact', () => {
  const id = 'existing_contact_id'
  const investigation = {
    started_at: 'date time',
    people: ['sally', 'bob'],
  }
  const contact = {id, people: ['bob']}
  const action = edit({id, investigation_id: 'existing_investigation_id'})

  it('fetches the contacts investigation', () => {
    const gen = editContact(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/existing_investigation_id/contacts/existing_contact_id')
    )
    expect(gen.next(contact).value).toEqual(
      call(get, '/api/v1/investigations/existing_investigation_id')
    )
    expect(gen.next(investigation).value).toEqual(
      put(
        editSuccess({
          investigation_id: 'existing_investigation_id',
          investigation_started_at: 'date time',
          investigation_people: ['sally', 'bob'],
          contact,
        })
      )
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = editContact(action)
    expect(gen.next().value).toEqual(
      call(get, '/api/v1/investigations/existing_investigation_id/contacts/existing_contact_id')
    )
    expect(gen.throw(error).value).toEqual(
      put(editFailure('some error'))
    )
  })
})
