export const CHECK_STAFF_PERMISSIONS = 'app/staff/CHECK_STAFF_PERMISSIONS'
export const CHECK_STAFF_PERMISSIONS_COMPLETE = 'app/staff/CHECK_STAFF_PERMISSIONS_COMPLETE'
export function checkStaffPermissions(permissions) {
  return {type: CHECK_STAFF_PERMISSIONS, payload: {permissions}}
}
export function checkStaffPermissionsSuccess(permissions, hasPermissions) {
  return {type: CHECK_STAFF_PERMISSIONS_COMPLETE, payload: {permissions, hasPermissions}}
}
export function checkStaffPermissionsFailure(error) {
  return {type: CHECK_STAFF_PERMISSIONS_COMPLETE, payload: {error}, error: true}
}
