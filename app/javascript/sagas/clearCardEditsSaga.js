import {takeEvery, put, select} from 'redux-saga/effects'
import {CLEAR_CARD_EDITS} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {resetAllegations} from 'actions/allegationsFormActions'
import {resetFieldValues as resetScreeningInformationValues} from 'actions/screeningInformationFormActions'
import {resetFieldValues as resetIncidentInformationValues} from 'actions/incidentInformationFormActions'
import {resetFieldValues as resetNarrativeFormValues} from 'actions/narrativeFormActions'
import {resetFieldValues as resetScreeningDecisionFormValues} from 'actions/screeningDecisionFormActions'
import {resetFieldValues as resetWorkerSafetyFormValues} from 'actions/workerSafetyFormActions'
import {resetFieldValues as resetCrossReportFormValues} from 'actions/crossReportFormActions'

export function* clearCardEdits({payload: {card}}) {
  const screening = yield select(getScreeningSelector)
  const actions = {
    allegations: resetAllegations,
    cross_reports: resetCrossReportFormValues,
    decision: resetScreeningDecisionFormValues,
    incident_information: resetIncidentInformationValues,
    narrative: resetNarrativeFormValues,
    screening_information: resetScreeningInformationValues,
    worker_safety: resetWorkerSafetyFormValues,
  }
  yield put(actions[card](screening.toJS()))
}
export function* clearCardEditsSaga() {
  yield takeEvery(CLEAR_CARD_EDITS, clearCardEdits)
}
