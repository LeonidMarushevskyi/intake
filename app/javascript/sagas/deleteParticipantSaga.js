import {takeEvery, put, call} from 'redux-saga/effects'
import {destroy} from 'utils/http'
import {
  deleteParticipantSuccess,
  deleteParticipantFailure,
} from 'actions/screeningActions'
import {DELETE_PARTICIPANT} from 'actions/actionTypes'

export function* deleteParticipant({id}) {
  try {
    yield call(destroy, `/api/v1/participants/${id}`)
    yield put(deleteParticipantSuccess(id))
  } catch (error) {
    yield put(deleteParticipantFailure(error.responseJSON))
  }
}
export function* deleteParticipantSaga() {
  yield takeEvery(DELETE_PARTICIPANT, deleteParticipant)
}
