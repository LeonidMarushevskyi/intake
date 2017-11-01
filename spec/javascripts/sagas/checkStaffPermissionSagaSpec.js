import 'babel-polyfill'
import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  checkStaffPermissionSaga,
  checkStaffPermission,
} from 'sagas/checkStaffPermissionSaga'
import * as actions from 'actions/staffActions'

describe('checkStaffPermissionSaga', () => {
  it('checks staff permission on CHECK_STAFF_PERMISSION', () => {
    const gen = checkStaffPermissionSaga()
    expect(gen.next().value).toEqual(takeLatest(actions.CHECK_STAFF_PERMISSION, checkStaffPermission))
  })
})

describe('checkStaffPermission', () => {
  const permission = 'add_sensitive_person'
  const hasPermission = true
  const action = actions.checkStaffPermission(permission)

  it('checks and puts staff permission', () => {
    const gen = checkStaffPermission(action)
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permission?permission=${permission}`))
    expect(gen.next(hasPermission).value).toEqual(
      put(actions.checkStaffPermissionSuccess(permission, hasPermission))
    )
  })

  it('puts errors when errors are thrown', () => {
    const error = {responseJSON: 'some error'}
    const gen = checkStaffPermission(action)
    expect(gen.next().value).toEqual(call(get, `/api/v1/security/check_permission?permission=${permission}`))
    expect(gen.throw(error).value).toEqual(
      put(actions.checkStaffPermissionFailure('some error'))
    )
  })
})
