import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchHistoryOfInvolvementsSuccess,
  fetchHistoryOfInvolvementsFailure,
} from 'actions/screeningActions'
import {
  FETCH_HISTORY_OF_INVOLVEMENTS,
} from 'actions/actionTypes'

export function* fetchHistoryOfInvolvements({payload: {id}}) {
  try {
    const response = yield call(get, `/api/v1/screenings/${id}/history_of_involvements`)
    yield put(fetchHistoryOfInvolvementsSuccess(response))
  } catch (error) {
    yield put(fetchHistoryOfInvolvementsFailure(error.responseJSON))
  }
}
export function* fetchHistoryOfInvolvementsSaga() {
  yield takeEvery(FETCH_HISTORY_OF_INVOLVEMENTS, fetchHistoryOfInvolvements)
}
