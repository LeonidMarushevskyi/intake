import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createSnapshotSuccess,
  createSnapshotFailure,
} from 'actions/snapshotActions'
import {CREATE_SNAPSHOT} from 'actions/actionTypes'
import {push} from 'react-router-redux'

export function* createSnapshot() {
  try {
    const response = yield call(post, '/api/v1/snapshots')
    const snapshotPath = '/snapshot'
    yield put(createSnapshotSuccess(response))
    yield put(push(snapshotPath))
  } catch (error) {
    yield put(createSnapshotFailure(error))
  }
}
export function* createSnapshotSaga() {
  yield takeEvery(CREATE_SNAPSHOT, createSnapshot)
}

