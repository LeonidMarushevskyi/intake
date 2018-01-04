import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createScreeningSuccess,
  createScreeningFailure,
} from 'actions/screeningActions'
import {CREATE_SCREENING} from 'actions/actionTypes'
import {push} from 'react-router-redux'

export function* createScreening() {
  try {
    const response = yield call(post, '/api/v1/screenings')
    const {id} = response
    const screeningEditPath = `/screenings/${id}/edit`
    yield put(createScreeningSuccess(response))
    yield put(push(screeningEditPath))
  } catch (error) {
    yield put(createScreeningFailure(error))
  }
}
export function* createScreeningSaga() {
  yield takeEvery(CREATE_SCREENING, createScreening)
}
