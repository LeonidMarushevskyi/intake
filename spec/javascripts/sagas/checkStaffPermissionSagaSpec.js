import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  checkStaffPermissionsSaga,
  checkStaffPermissions,
} from 'sagas/checkStaffPermissionsSaga'
import * as actions from 'actions/staffActions'

describe('checkStaffPermissionsSaga', () => {
  it('checks staff permission on CHECK_STAFF_PERMISSIONS', () => {
    const gen = checkStaffPermissionsSaga()
    expect(gen.next().value).toEqual(takeLatest(actions.CHECK_STAFF_PERMISSIONS, checkStaffPermissions))
  })
})

describe('checkStaffPermissions', () => {
  const permissions = ['add_sensitive_person', 'remove_x']
  const hasPermission = true
  const action = actions.checkStaffPermissions(permissions)

  it('checks and puts staff permissions', () => {
    const gen = checkStaffPermissions(action)
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permissions?permissions=${permissions}`))
    expect(gen.next(hasPermission).value).toEqual(
      put(actions.checkStaffPermissionsSuccess(permissions, hasPermission))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = checkStaffPermissions(action)
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permissions?permissions=${permissions}`))
    expect(gen.throw(error).value).toEqual(
      put(actions.checkStaffPermissionsFailure('some error'))
    )
  })
})
