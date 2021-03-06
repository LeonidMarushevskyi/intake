import {takeEvery, put, call} from 'redux-saga/effects'
import {STATUS_CODES, post} from 'utils/http'
import {
  CREATE_SNAPSHOT_PERSON,
  createPersonSuccess,
  createPersonFailure,
} from 'actions/personCardActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'
import {fetchRelationships} from 'actions/relationshipsActions'

export function* createSnapshotPerson({payload: {person}}) {
  try {
    const {snapshotId, legacy_descriptor} = person
    const {legacy_id, legacy_table_name} = legacy_descriptor || {}
    const response = yield call(post, '/api/v1/participants', {
      participant: {
        screening_id: snapshotId,
        legacy_descriptor: {
          legacy_id,
          legacy_table_name,
        },
      },
    })
    yield put(createPersonSuccess(response))
    yield put(fetchRelationships('snapshots', snapshotId))
    yield put(fetchHistoryOfInvolvements('snapshots', snapshotId))
  } catch (error) {
    if (error.status === STATUS_CODES.forbidden) {
      yield call(alert, 'You are not authorized to add this person.')
    } else {
      yield put(createPersonFailure(error.responseJSON))
    }
  }
}
export function* createSnapshotPersonSaga() {
  yield takeEvery(CREATE_SNAPSHOT_PERSON, createSnapshotPerson)
}

