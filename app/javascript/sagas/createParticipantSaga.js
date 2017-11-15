import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  CREATE_PERSON,
  createPersonSuccess,
  createPersonFailure,
} from 'actions/personCardActions'
import {
  fetchRelationships,
  fetchHistoryOfInvolvements,
} from 'actions/screeningActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'

export function* createParticipant({payload: {person}}) {
  try {
    const response = yield call(post, '/api/v1/participants', person)
    yield put(createPersonSuccess(response))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchRelationships(screeningId))
    yield put(fetchHistoryOfInvolvements(screeningId))
  } catch (error) {
    yield put(createPersonFailure(error.responseJSON))
  }
}
export function* createParticipantSaga() {
  yield takeEvery(CREATE_PERSON, createParticipant)
}
