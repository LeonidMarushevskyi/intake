import {takeEvery, put, call, select} from 'redux-saga/effects'
import * as api from 'utils/http'
import {saveSuccess, saveFailure, SAVE_SCREENING} from 'actions/screeningActions'
import {getScreeningWithAllegationsEditsSelector} from 'selectors/screening/allegationsFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithScreeningInformationEditsSelector,
} from 'selectors/screening/screeningInformationFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithNarrativeEditsSelector,
} from 'selectors/screening/narrativeFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithIncidentInformationEditsSelector,
} from 'selectors/screening/incidentInformationFormSelector'
import {
  getScreeningWithEditsSelector as getScreeningWithWorkerSafetyEditsSelector,
} from 'selectors/screening/workerSafetyFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithCrossReportEditsSelector,
} from 'selectors/screening/crossReportFormSelectors'
import {
  getScreeningWithEditsSelector as getScreeningWithDecisionEditsSelector,
} from 'selectors/screening/decisionFormSelectors'

export function* saveScreeningCard({payload: {card}}) {
  try {
    let screening
    switch (card) {
      case 'allegations': {
        screening = yield select(getScreeningWithAllegationsEditsSelector)
        break
      }
      case 'cross_reports': {
        screening = yield select(getScreeningWithCrossReportEditsSelector)
        break
      }
      case 'decision': {
        screening = yield select(getScreeningWithDecisionEditsSelector)
        break
      }
      case 'incident_information': {
        screening = yield select(getScreeningWithIncidentInformationEditsSelector)
        break
      }
      case 'narrative': {
        screening = yield select(getScreeningWithNarrativeEditsSelector)
        break
      }
      case 'screening_information': {
        screening = yield select(getScreeningWithScreeningInformationEditsSelector)
        break
      }
      case 'worker_safety': {
        screening = yield select(getScreeningWithWorkerSafetyEditsSelector)
        break
      }
    }
    const id = screening.get('id')
    const path = `/api/v1/screenings/${id}`
    const response = yield call(api.put, path, screening.toJS())
    yield put(saveSuccess(response))
  } catch (error) {
    yield put(saveFailure(error))
  }
}
export function* saveScreeningCardSaga() {
  yield takeEvery(SAVE_SCREENING, saveScreeningCard)
}
