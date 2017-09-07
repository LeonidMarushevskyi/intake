import * as matchers from 'jasmine-immutable-matchers'
import {checkStaffPermissionSuccess} from 'actions/staffActions'
import staffReducer from 'reducers/staffReducer'
import {Map} from 'immutable'

describe('staffReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CHECK_STAFF_PERMISSION_SUCCESS', () => {
    it('returns true if the current staff has permission', () => {
      const hasPermission = true
      const action = checkStaffPermissionSuccess('mypermission', hasPermission)
      expect(staffReducer(Map(), action)).toEqualImmutable(
        Map({mypermission: true})
      )
    })
  })
})
