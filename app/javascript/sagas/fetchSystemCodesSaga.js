import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchSuccess, fetchFailure, FETCH_SYSTEM_CODES} from 'actions/systemCodesActions'

export function* fetchSystemCodes() {
  try {
    const response = yield call(get, '/api/v1/system_codes')
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchSystemCodesSaga() {
  yield takeEvery(FETCH_SYSTEM_CODES, fetchSystemCodes)
}
