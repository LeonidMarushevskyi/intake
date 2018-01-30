import {
  CREATE_SNAPSHOT,
  CREATE_SCREENING_COMPLETE,
} from 'actions/actionTypes'

export function createSnapshotSuccess(screening) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {screening}}
}
export function createSnapshotFailure(error) {
  return {type: CREATE_SCREENING_COMPLETE, payload: {error}, error: true}
}
export function createSnapshot() {
  return {type: CREATE_SNAPSHOT}
}
