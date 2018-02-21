import * as matchers from 'jasmine-immutable-matchers'
import {
  createSnapshotSuccess,
  createSnapshotFailure,
  clearSnapshot,
} from 'actions/snapshotActions'
import snapshotReducer from 'reducers/snapshotReducer'
import {Map, fromJS} from 'immutable'

describe('snapshotReducer', () => {
  beforeEach(() => jasmine.addMatchers(matchers))

  describe('on CREATE_SNAPSHOT_COMPLETE', () => {
    it('returns the snapshot from the action on success', () => {
      const snapshot = {id: '1'}
      const action = createSnapshotSuccess(snapshot)
      expect(snapshotReducer(Map(), action)).toEqualImmutable(
        fromJS({id: '1', history: {cases: [], referrals: [], screenings: []}})
      )
    })
    it('returns the last state on failure', () => {
      const action = createSnapshotFailure()
      expect(snapshotReducer(Map(), action)).toEqualImmutable(Map())
    })
  })

  describe('on CLEAR_SNAPSHOT', () => {
    it('clears all the snapshot data from the store', () => {
      const oldState = fromJS({id: 1})
      const action = clearSnapshot()
      expect(snapshotReducer(oldState, action)).toEqual(Map())
    })
  })
})
