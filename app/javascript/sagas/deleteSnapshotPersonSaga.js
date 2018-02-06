import {takeEvery, put, call, select} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  DELETE_SNAPSHOT_PERSON,
  deletePersonSuccess,
  deletePersonFailure,
} from 'actions/personCardActions'
import {
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getSnapshotIdValueSelector} from 'selectors/snapshotSelectors'

export function* deleteSnapshotPerson({payload: {id}}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deletePersonSuccess(id))
    const snapshotId = yield select(getSnapshotIdValueSelector)
    yield put(fetchHistoryOfInvolvements(snapshotId))
  } catch (error) {
    yield put(deletePersonFailure(error.responseJSON))
  }
}
export function* deleteSnapshotPersonSaga() {
  yield takeEvery(DELETE_SNAPSHOT_PERSON, deleteSnapshotPerson)
}

