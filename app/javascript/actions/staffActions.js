export const CHECK_STAFF_PERMISSION = 'app/staff/CHECK_STAFF_PERMISSION'
export const CHECK_STAFF_PERMISSION_SUCCESS = 'app/staff/CHECK_STAFF_PERMISSION_SUCCESS'
export const CHECK_STAFF_PERMISSION_FAILURE = 'app/staff/CHECK_STAFF_PERMISSION_FAILURE'
export function checkStaffPermission(permission) {
  return {type: CHECK_STAFF_PERMISSION, payload: {permission}}
}
export function checkStaffPermissionSuccess(permission, hasPermission) {
  return {type: CHECK_STAFF_PERMISSION_SUCCESS, payload: {permission, hasPermission}}
}
export function checkStaffPermissionFailure(error) {
  return {type: CHECK_STAFF_PERMISSION_FAILURE, payload: {error}}
}
