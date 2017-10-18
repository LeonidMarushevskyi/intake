import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
  FETCH_INVESTIGATION,
} from 'actions/investigationActions'

export function* loadInvestigation({id}) {
  try {
    const response = yield call(get, `/api/v1/investigations/${id}`)
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error.responseJSON))
  }
}

export function* fetchInvestigationSaga() {
  yield takeLatest(FETCH_INVESTIGATION, loadInvestigation)
}

