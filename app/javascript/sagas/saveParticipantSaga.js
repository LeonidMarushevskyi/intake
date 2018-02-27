import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  UPDATE_PERSON,
  updatePersonSuccess,
  updatePersonFailure,
} from 'actions/personCardActions'
import {fetch as fetchAllegations} from 'actions/screeningAllegationsActions'
import {getScreeningIdValueSelector} from 'selectors/screeningSelectors'
import {fetchRelationships} from 'actions/relationshipsActions'
import {fetchHistoryOfInvolvements} from 'actions/historyOfInvolvementActions'

export function* saveParticipant({payload: {person}}) {
  try {
    const response = yield call(Utils.put, `/api/v1/participants/${person.id}`, person)
    yield put(updatePersonSuccess(response))
    const screeningId = yield select(getScreeningIdValueSelector)
    yield put(fetchRelationships('screenings', screeningId))
    yield put(fetchHistoryOfInvolvements('screenings', screeningId))
    yield put(fetchAllegations(screeningId))
  } catch (error) {
    yield put(updatePersonFailure(error.responseJSON))
  }
}
export function* saveParticipantSaga() {
  yield takeEvery(UPDATE_PERSON, saveParticipant)
}
