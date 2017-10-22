import {takeEvery, put, call} from 'redux-saga/effects'
import {push} from 'react-router-redux'
import {post} from 'utils/http'
import {
  createSuccess,
  createFailure,
  CREATE_CONTACT,
} from 'actions/contactActions'

export function* saveContact(contact) {
  try {
    const investigationId = contact.investigation_id
    const response = yield call(
      post, `/api/v1/investigations/${investigationId}/contacts`, contact
    )
    yield put(createSuccess(response))
    const {id} = response
    const show_contact_path = `/investigations/${investigationId}/contacts/${id}`
    yield put(push(show_contact_path))
  } catch (error) {
    yield put(createFailure(error.responseJSON))
  }
}
export function* saveContactSaga() {
  yield takeEvery(CREATE_CONTACT, saveContact)
}
