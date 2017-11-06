import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  CREATE_PARTICIPANT,
  createParticipantSuccess,
  createParticipantFailure,
} from 'actions/personActions'
import {
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'

export function* createParticipant({payload: {participant}}) {
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
