export const CHECK_STAFF_PERMISSION = 'app/staff/CHECK_STAFF_PERMISSION'
export const CHECK_STAFF_PERMISSION_SUCCESS = 'app/staff/CHECK_STAFF_PERMISSION_SUCCESS'
export const CHECK_STAFF_PERMISSION_FAILURE = 'app/staff/CHECK_STAFF_PERMISSION_FAILURE'

export function checkStaffPermission(permission) {
  return {type: CHECK_STAFF_PERMISSION, permission}
}

export function checkStaffPermissionSuccess(permission, hasPermission) {
  return {type: CHECK_STAFF_PERMISSION_SUCCESS, permission, hasPermission}
}

export function checkStaffPermissionFailure(error) {
  return {type: CHECK_STAFF_PERMISSION_FAILURE, error}
}
