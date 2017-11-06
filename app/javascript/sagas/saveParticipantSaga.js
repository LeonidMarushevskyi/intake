import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as Utils from 'utils/http'
import {
  UPDATE_PERSON,
  updatePersonSuccess,
  updatePersonFailure,
} from 'actions/personCardActions'
import {
  fetchScreeningSuccess,
} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'

export function* saveParticipant({payload: {person}}) {
  try {
    let response = yield call(Utils.put, `/api/v1/participants/${person.id}`, person)
    yield put(updatePersonSuccess(response))
    const screening = yield select(getScreeningSelector)
    response = yield call(Utils.get, `/api/v1/screenings/${screening.get('id')}`)
    yield put(fetchScreeningSuccess(response))
  } catch (error) {
    yield put(updatePersonFailure(error.responseJSON))
  }
}
export function* saveParticipantSaga() {
  yield takeEvery(UPDATE_PERSON, saveParticipant)
}
