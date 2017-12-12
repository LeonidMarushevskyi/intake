import {takeLatest, put, call} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {get} from 'utils/http'
import {FETCH_PEOPLE_SEARCH, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'

export function* fetchPeopleSearch({payload: {searchTerm}}) {
  try {
    const TIME_TO_DEBOUNCE = 400
    yield call(delay, TIME_TO_DEBOUNCE)
    const response = yield call(get, '/api/v1/people/search', {search_term: searchTerm})
    yield put(fetchSuccess(response))
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchPeopleSearchSaga() {
  yield takeLatest(FETCH_PEOPLE_SEARCH, fetchPeopleSearch)
}
