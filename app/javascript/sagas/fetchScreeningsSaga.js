import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchSuccess, fetchFailure, FETCH_SCREENINGS} from 'actions/screeningsActions'

export function* fetchScreenings() {
  try {
    const response = yield call(get, '/api/v1/screenings')
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchScreeningsSaga() {
  yield takeEvery(FETCH_SCREENINGS, fetchScreenings)
}
