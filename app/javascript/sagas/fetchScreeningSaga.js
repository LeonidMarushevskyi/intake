import {takeEvery, put, call} from 'redux-saga/effects'
import {replace} from 'react-router-redux'
import {STATUS_CODES, get} from 'utils/http'
import {
  fetchScreeningSuccess,
  fetchScreeningFailure,
} from 'actions/screeningActions'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {FETCH_SCREENING} from 'actions/actionTypes'

export function* fetchScreening({payload: {id}}) {
  try {
    const response = yield call(get, `/api/v1/screenings/${id}`)
    const {cross_reports} = response
    if (cross_reports && cross_reports.length > 0) {
      const {county_id} = cross_reports[0]
      if (county_id && county_id !== '') {
        yield put(fetchCountyAgencies(county_id))
      }
    }
    yield put(fetchScreeningSuccess(response))
  } catch (error) {
    switch (error.status) {
      case STATUS_CODES.forbidden: {
        yield put(replace('/forbidden'))
        break
      }
      case STATUS_CODES.notFound: {
        yield put(replace('/notFound'))
        break
      }
      default: {
        yield put(fetchScreeningFailure(error.responseJSON))
      }
    }
  }
}
export function* fetchScreeningSaga() {
  yield takeEvery(FETCH_SCREENING, fetchScreening)
}
