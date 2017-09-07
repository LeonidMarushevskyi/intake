import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
  FETCH_SCREENING_SUMMARY,
} from 'actions/screeningSummaryActions'

export function* loadScreeningSummary({id}) {
  try {
    const response = yield call(get, `/api/v1/investigations/${id}/screening`)
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error.responseJSON))
  }
}

export function* fetchScreeningSummarySaga() {
  yield takeLatest(FETCH_SCREENING_SUMMARY, loadScreeningSummary)
}
