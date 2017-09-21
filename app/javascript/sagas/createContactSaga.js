import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createSuccess,
  createFailure,
  CREATE_CONTACT,
} from 'actions/contactActions'

export function* createContact(contact) {
  try {
    const response = yield call(
      post, `/api/v1/investigations/${contact.investigation_id}/contacts`, contact
    )
    yield put(createSuccess(response))
  } catch (error) {
    yield put(createFailure(error.responseJSON))
  }
}
export function* createContactSaga() {
  yield takeEvery(CREATE_CONTACT, createContact)
}
