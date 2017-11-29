import {takeEvery, put, call} from 'redux-saga/effects'
import {replace} from 'react-router-redux'
import {STATUS_CODES, get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
  FETCH_CONTACT,
} from 'actions/contactActions'

export function* fetchContact({payload: {investigation_id, id}}) {
  try {
    const contact = yield call(
      get, `/api/v1/investigations/${investigation_id}/contacts/${id}`)
    yield put(fetchSuccess(investigation_id, contact))
  } catch (error) {
    switch (error.status) {
      case STATUS_CODES.notFound: {
        yield put(replace('/notFound'))
        break
      }
      default: {
        yield put(fetchFailure(error.responseJSON))
      }
    }
  }
}
export function* fetchContactSaga() {
  yield takeEvery(FETCH_CONTACT, fetchContact)
}
