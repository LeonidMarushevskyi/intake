import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchScreeningSuccess,
  fetchScreeningFailure,
} from 'actions/screeningActions'
import {FETCH_SCREENING} from 'actions/actionTypes'

export function* fetchScreening({id}) {
  try {
    const response = yield call(get, `/api/v1/screenings/${id}`)
    yield put(fetchScreeningSuccess(response))
  } catch (error) {
    yield put(fetchScreeningFailure(error.responseJSON))
  }
}
export function* fetchScreeningSaga() {
  yield takeEvery(FETCH_SCREENING, fetchScreening)
}
