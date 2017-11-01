export const CHECK_STAFF_PERMISSION = 'app/staff/CHECK_STAFF_PERMISSION'
export const CHECK_STAFF_PERMISSION_COMPLETE = 'app/staff/CHECK_STAFF_PERMISSION_COMPLETE'
export function checkStaffPermission(permission) {
  return {type: CHECK_STAFF_PERMISSION, payload: {permission}}
}
export function checkStaffPermissionSuccess(permission, hasPermission) {
  return {type: CHECK_STAFF_PERMISSION_COMPLETE, payload: {permission, hasPermission}}
}
export function checkStaffPermissionFailure(error) {
  return {type: CHECK_STAFF_PERMISSION_COMPLETE, payload: {error}, error: true}
}
