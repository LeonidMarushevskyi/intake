import {takeEvery, put, call} from 'redux-saga/effects'
import {push} from 'react-router-redux'
import * as api from 'utils/http'
import {
  saveSuccess,
  saveFailure,
  SAVE_CONTACT,
} from 'actions/contactActions'

export function* saveContact({payload}) {
  try {
    const investigationId = payload.investigation_id
    const id = payload.id
    let path
    let method
    if (id) {
      path = `/api/v1/investigations/${investigationId}/contacts/${id}`
      method = api.put
    } else {
      path = `/api/v1/investigations/${investigationId}/contacts`
      method = api.post
    }
    const response = yield call(method, path, payload)
    yield put(saveSuccess(response))
    const contactId = response.legacy_descriptor.legacy_id
    const show_contact_path = `/investigations/${investigationId}/contacts/${contactId}`
    yield put(push(show_contact_path))
  } catch (error) {
    yield put(saveFailure(error.responseJSON))
  }
}
export function* saveContactSaga() {
  yield takeEvery(SAVE_CONTACT, saveContact)
}
