import {
  CREATE_SNAPSHOT,
  CREATE_SNAPSHOT_COMPLETE,
} from 'actions/actionTypes'

export function createSnapshotSuccess(snapshot) {
  return {type: CREATE_SNAPSHOT_COMPLETE, payload: {snapshot}}
}
export function createSnapshotFailure(error) {
  return {type: CREATE_SNAPSHOT_COMPLETE, payload: {error}, error: true}
}
export function createSnapshot() {
  return {type: CREATE_SNAPSHOT}
}
