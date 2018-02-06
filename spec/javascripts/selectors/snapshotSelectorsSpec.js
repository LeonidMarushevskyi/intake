import {fromJS} from 'immutable'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'

describe('snapshotSelectors', () => {
  describe('getSnapshotIdValueSelector', () => {
    it('returns the id of the snapshot', () => {
      const state = fromJS({snapshot: {id: '4'}})
      expect(getSnapshotIdValueSelector(state)).toEqual('4')
    })
  })
})

