import * as matchers from 'jasmine-immutable-matchers'
import {
  checkStaffPermissionsSuccess,
  checkStaffPermissionsFailure,
} from 'actions/staffActions'
import staffReducer from 'reducers/staffReducer'
import {Map} from 'immutable'

describe('staffReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CHECK_STAFF_PERMISSIONS_COMPLETE', () => {
    it('returns a hash with permissions on success', () => {
      const action = checkStaffPermissionsSuccess(['add_something', 'view_something'], {add_something: true, view_something: false})
      expect(staffReducer(Map(), action)).toEqualImmutable(
        Map({permissions: Map({add_something: true, view_something: false})})
      )
    })

    it('returns the last state on failure', () => {
      const action = checkStaffPermissionsFailure()
      expect(staffReducer(Map(), action)).toEqualImmutable(
        Map()
      )
    })
  })
})
