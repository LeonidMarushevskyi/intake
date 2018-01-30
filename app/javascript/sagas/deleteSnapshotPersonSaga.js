import {takeEvery, put, call} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  DELETE_SNAPSHOT_PERSON,
  deletePersonSuccess,
  deletePersonFailure,
} from 'actions/personCardActions'

export function* deleteSnapshotPerson({payload: {id}}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deletePersonSuccess(id))
  } catch (error) {
    yield put(deletePersonFailure(error.responseJSON))
  }
}
export function* deleteSnapshotPersonSaga() {
  yield takeEvery(DELETE_SNAPSHOT_PERSON, deleteSnapshotPerson)
}

