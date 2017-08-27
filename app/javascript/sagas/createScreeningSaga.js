import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {CREATE_SCREENING} from 'actions/actionTypes'

export function* createScreening() {
  try {
    const response = yield call(post, '/api/v1/screenings')
    yield put(createScreeningSuccess(response))
  } catch (error) {
    yield put(createScreeningFailure(error.responseJSON))
  }
}
export function* createScreeningSaga() {
  yield takeEvery(CREATE_SCREENING, createScreening)
}
