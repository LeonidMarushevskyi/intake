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
    const {screening_id, legacy_descriptor} = person
    const {legacy_id, legacy_table_name} = legacy_descriptor || {}
    const response = yield call(post, '/api/v1/participants', {
      participant: {
        screening_id,
        legacy_descriptor: {
          legacy_id,
          legacy_table_name,
        },
      },
    })
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
