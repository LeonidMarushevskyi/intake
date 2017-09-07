import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {checkStaffPermissionSaga, checkStaffPermission} from 'sagas/checkStaffPermissionSaga'
import {CHECK_STAFF_PERMISSION} from 'actions/staffActionTypes'
import {
  checkStaffPermissionSuccess,
  checkStaffPermissionFailure,
} from 'actions/staffActions'

describe('checkStaffPermissionSaga', () => {
  it('checks staff permission on CHECK_STAFF_PERMISSION', () => {
    const gen = checkStaffPermissionSaga()
    expect(gen.next().value).toEqual(takeLatest(CHECK_STAFF_PERMISSION, checkStaffPermission))
  })
})

describe('checkStaffPermission', () => {
  it('checks and puts staff permission', () => {
    const permission = 'add_sensitive_person'
    const hasPermission = true
    const gen = checkStaffPermission({permission})
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permission?permission=${permission}`))
    expect(gen.next(hasPermission).value).toEqual(
      put(checkStaffPermissionSuccess(permission, hasPermission))
    )
  })

  it('puts errors when errors are thrown', () => {
    const permission = 'add_sensitive_person'
    const error = {responseJSON: 'some error'}
    const gen = checkStaffPermission({permission})
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permission?permission=${permission}`))
    expect(gen.throw(error).value).toEqual(
      put(checkStaffPermissionFailure('some error'))
    )
  })
})
