import {takeEvery, call, put} from 'redux-saga/effects'
import {EDIT_CONTACT, editSuccess, editFailure} from 'actions/contactFormActions'
import {get} from 'utils/http'

export function* editContact({payload: {id, investigation_id}}) {
  try {
    const contact = yield call(get, `/api/v1/investigations/${investigation_id}/contacts/${id}`)
    const {people, started_at} = yield call(get, `/api/v1/investigations/${investigation_id}`)
    yield put(
      editSuccess({
        investigation_id,
        investigation_started_at: started_at,
        investigation_people: people,
        contact,
      })
    )
  } catch (error) {
    yield put(editFailure(error.responseJSON))
  }
}
export function* editContactSaga() {
  yield takeEvery(EDIT_CONTACT, editContact)
}
