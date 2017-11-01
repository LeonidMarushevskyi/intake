import * as matchers from 'jasmine-immutable-matchers'
import {
  checkStaffPermissionSuccess,
  checkStaffPermissionFailure,
} from 'actions/staffActions'
import staffReducer from 'reducers/staffReducer'
import {Map} from 'immutable'

describe('staffReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CHECK_STAFF_PERMISSION_COMPLETE', () => {
    it('returns true if the current staff has permission on success', () => {
      const hasPermission = true
      const action = checkStaffPermissionSuccess('mypermission', hasPermission)
      expect(staffReducer(Map(), action)).toEqualImmutable(
        Map({mypermission: true})
      )
    })

    it('returns the last state on failure', () => {
      const action = checkStaffPermissionFailure()
      expect(staffReducer(Map(), action)).toEqualImmutable(
        Map()
      )
    })
  })
})
