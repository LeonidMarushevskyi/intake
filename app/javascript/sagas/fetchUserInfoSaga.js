import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchSuccess, fetchFailure, FETCH_USER_INFO} from 'actions/userInfoActions'

export function* fetchUserInfo() {
  try {
    const response = yield call(get, '/api/v1/user_info')
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchUserInfoSaga() {
  yield takeEvery(FETCH_USER_INFO, fetchUserInfo)
}
