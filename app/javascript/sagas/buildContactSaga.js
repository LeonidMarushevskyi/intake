import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {BUILD_CONTACT, buildSuccess, buildFailure} from 'actions/contactFormActions'
import {fetchSuccess} from 'actions/investigationActions'

export function* buildContact({investigation_id}) {
  try {
    const investigation = yield call(get, `/api/v1/investigations/${investigation_id}`)
    yield put(fetchSuccess(investigation))
    yield put(
      buildSuccess({
        investigation_id,
        investigation_started_at: investigation.started_at,
      })
    )
  } catch (error) {
    yield put(buildFailure(error.responseJSON))
  }
}
export function* buildContactSaga() {
  yield takeEvery(BUILD_CONTACT, buildContact)
}
