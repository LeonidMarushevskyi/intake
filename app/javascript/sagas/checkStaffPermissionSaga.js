import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  checkStaffPermissionSuccess,
  checkStaffPermissionFailure,
} from 'actions/staffActions'
import {CHECK_STAFF_PERMISSION} from 'actions/staffActionTypes'

export function* checkStaffPermission({permission}) {
  try {
    const response = yield call(get, `/api/v1/security/check_permission?permission=${permission}`)
    yield put(checkStaffPermissionSuccess(permission, response))
  } catch (error) {
    yield put(checkStaffPermissionFailure(error.responseJSON))
  }
}
export function* checkStaffPermissionSaga() {
  yield takeLatest(CHECK_STAFF_PERMISSION, checkStaffPermission)
}
