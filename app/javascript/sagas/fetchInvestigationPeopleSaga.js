import {takeLatest, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
  FETCH_INVESTIGATION_PEOPLE,
} from 'actions/investigationPeopleActions'

export function* loadInvestigationPeople({investigationId}) {
  try {
    const response = yield call(get, `/api/v1/investigations/${investigationId}/people`)
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error.responseJSON))
  }
}

export function* fetchInvestigationPeopleSaga() {
  yield takeLatest(FETCH_INVESTIGATION_PEOPLE, loadInvestigationPeople)
}
