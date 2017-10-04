import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {fetchSuccess, fetchFailure, FETCH_COUNTY_AGENCIES} from 'actions/countyAgenciesActions'

export function* fetchCountyAgencies({countyId}) {
  try {
    const response = yield call(get, `/api/v1/cross_report_agency/${countyId}`)
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchCountyAgenciesSaga() {
  yield takeEvery(FETCH_COUNTY_AGENCIES, fetchCountyAgencies)
}
