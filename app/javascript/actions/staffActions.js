import {
  CHECK_STAFF_PERMISSION,
  CHECK_STAFF_PERMISSION_SUCCESS,
  CHECK_STAFF_PERMISSION_FAILURE,
} from 'actions/staffActionTypes'

export function checkStaffPermission(permission) {
  return {type: CHECK_STAFF_PERMISSION, permission}
}

export function checkStaffPermissionSuccess(permission, hasPermission) {
  return {type: CHECK_STAFF_PERMISSION_SUCCESS, permission, hasPermission}
}

export function checkStaffPermissionFailure(error) {
  return {type: CHECK_STAFF_PERMISSION_FAILURE, error}
}
