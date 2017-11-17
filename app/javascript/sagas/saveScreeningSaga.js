import {takeEvery, put, call} from 'redux-saga/effects'
import * as api from 'utils/http'
import {saveSuccess, saveFailure, SAVE_SCREENING} from 'actions/screeningActions'

export function* saveScreening({payload: {screening}}) {
  try {
    const id = screening.id
    const path = `/api/v1/screenings/${id}`
    const response = yield call(api.put, path, screening)
    yield put(saveSuccess(response))
  } catch (error) {
    yield put(saveFailure(error.responseJSON))
  }
}
export function* saveScreeningSaga() {
  yield takeEvery(SAVE_SCREENING, saveScreening)
}
