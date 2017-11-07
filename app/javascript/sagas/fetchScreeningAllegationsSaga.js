import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
} from 'actions/screeningAllegationsActions'
import {FETCH_SCREENING_ALLEGATIONS} from 'actions/screeningAllegationsActions'

export function* fetchAllegations({payload: {screeningId}}) {
  try {
    const response = yield call(get, `/api/v1/screenings/${screeningId}`)
    yield put(fetchSuccess(response.allegations))
  } catch (error) {
    yield put(fetchFailure(error.responseJSON))
  }
}
export function* fetchScreeningAllegationsSaga() {
  yield takeEvery(FETCH_SCREENING_ALLEGATIONS, fetchAllegations)
}
