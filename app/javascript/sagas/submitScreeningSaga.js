import {takeEvery, put, call, select} from 'redux-saga/effects'
import {post} from 'utils/http'
import {
  submitScreeningSuccess,
  submitScreeningFailure,
} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {
  SUBMIT_SCREENING,
} from 'actions/actionTypes'

export function* submitScreening({id}) {
  try {
    const response = yield call(post, `/api/v1/screenings/${id}/submit`)
    yield put(submitScreeningSuccess(response))
    const screening = yield select(getScreeningSelector)
    yield call(console.log, `Successfully created referral ${screening.get('referral_id')}`)
  } catch (error) {
    yield put(submitScreeningFailure(error.responseJSON))
    yield call(console.log, error)
  }
}
export function* submitScreeningSaga() {
  yield takeEvery(SUBMIT_SCREENING, submitScreening)
}
