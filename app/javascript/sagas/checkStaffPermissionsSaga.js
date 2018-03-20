import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  checkStaffPermissionsSuccess,
  checkStaffPermissionsFailure,
  CHECK_STAFF_PERMISSIONS,
} from 'actions/staffActions'

export function* checkStaffPermissions({payload: {permissions}}) {
  try {
    const response = yield call(get, `/api/v1/security/check_permissions?permissions=${permissions}`)
    yield put(checkStaffPermissionsSuccess(permissions, response))
  } catch (error) {
    yield put(checkStaffPermissionsFailure(error.responseJSON))
  }
}
export function* checkStaffPermissionsSaga() {
  yield takeLatest(CHECK_STAFF_PERMISSIONS, checkStaffPermissions)
}
