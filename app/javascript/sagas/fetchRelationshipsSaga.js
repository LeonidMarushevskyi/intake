import {takeEvery, put, call} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  fetchRelationshipsSuccess,
  fetchRelationshipsFailure,
} from 'actions/relationshipsActions'
import {
  FETCH_RELATIONSHIPS,
} from 'actions/actionTypes'

export function* fetchRelationships({payload: {id, type}}) {
  try {
    const response = yield call(get, `/api/v1/${type}/${id}/relationships`)
    yield put(fetchRelationshipsSuccess(response))
  } catch (error) {
    yield put(fetchRelationshipsFailure(error.responseJSON))
  }
}
export function* fetchRelationshipsSaga() {
  yield takeEvery(FETCH_RELATIONSHIPS, fetchRelationships)
}
