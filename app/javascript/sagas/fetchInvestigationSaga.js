import {takeLatest, put, call} from 'redux-saga/effects'
import {replace} from 'react-router-redux'
import {STATUS_CODES, get} from 'utils/http'
import {
  fetchSuccess,
  fetchFailure,
  FETCH_INVESTIGATION,
} from 'actions/investigationActions'

export function* loadInvestigation({payload: {id}}) {
  try {
    const response = yield call(get, `/api/v1/investigations/${id}`)
    yield put(fetchSuccess(response))
  } catch (error) {
    switch (error.status) {
      case STATUS_CODES.notFound: {
        yield put(replace('/notFound'))
        break
      }
      default: {
        yield put(fetchFailure(error.responseJSON))
      }
    }
  }
}

export function* fetchInvestigationSaga() {
  yield takeLatest(FETCH_INVESTIGATION, loadInvestigation)
}

