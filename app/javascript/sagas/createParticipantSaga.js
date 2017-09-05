import {takeEvery, put, call} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createParticipantSuccess,
  createParticipantFailure,
} from 'actions/screeningActions'
import {CREATE_PARTICIPANT} from 'actions/actionTypes'

export function* createParticipant({participant}) {
  try {
    const response = yield call(post, '/api/v1/participants', participant)
    yield put(createParticipantSuccess(response))
  } catch (error) {
    yield put(createParticipantFailure(error.responseJSON))
  }
}
export function* createParticipantSaga() {
  yield takeEvery(CREATE_PARTICIPANT, createParticipant)
}
