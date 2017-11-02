import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  createParticipantSuccess,
  createParticipantFailure,
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {CREATE_PARTICIPANT} from 'actions/actionTypes'

export function* createParticipant({participant}) {
  try {
    const response = yield call(post, '/api/v1/participants', participant)
    yield put(createParticipantSuccess(response))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchRelationships(screeningId))
    yield put(fetchHistoryOfInvolvements(screeningId))
  } catch (error) {
    yield put(createParticipantFailure(error.responseJSON))
  }
}
export function* createParticipantSaga() {
  yield takeEvery(CREATE_PARTICIPANT, createParticipant)
}
