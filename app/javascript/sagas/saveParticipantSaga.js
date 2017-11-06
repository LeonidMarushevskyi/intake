import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  UPDATE_PARTICIPANT,
  updateParticipantSuccess,
  updateParticipantFailure,
} from 'actions/personActions'
import {
  fetchScreeningSuccess,
} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'

export function* saveParticipant({payload: {participant}}) {
  try {
    let response = yield call(Utils.put, `/api/v1/participants/${participant.id}`, participant)
    yield put(updateParticipantSuccess(response))
    const screening = yield select(getScreeningSelector)
    response = yield call(Utils.get, `/api/v1/screenings/${screening.get('id')}`)
    yield put(fetchScreeningSuccess(response))
  } catch (error) {
    yield put(updateParticipantFailure(error.responseJSON))
  }
}
export function* saveParticipantSaga() {
  yield takeEvery(UPDATE_PARTICIPANT, saveParticipant)
}
