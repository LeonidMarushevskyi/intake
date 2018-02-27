import {takeEvery, put, select} from 'redux-saga/effects'
import {CLEAR_CARD_EDITS} from 'actions/screeningActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {resetAllegations} from 'actions/allegationsFormActions'
import {cardName as allegationsCardName} from 'containers/screenings/AllegationsFormContainer'
import {resetFieldValues as resetScreeningInformationValues} from 'actions/screeningInformationFormActions'
import {cardName as screeningInformationCardName} from 'containers/screenings/ScreeningInformationFormContainer'
import {resetFieldValues as resetIncidentInformationValues} from 'actions/incidentInformationFormActions'
import {cardName as incidentInformationCardName} from 'containers/screenings/IncidentInformationFormContainer'
import {resetFieldValues as resetNarrativeFormValues} from 'actions/narrativeFormActions'
import {cardName as narrativeCardName} from 'containers/screenings/NarrativeFormContainer'
import {resetFieldValues as resetScreeningDecisionFormValues} from 'actions/screeningDecisionFormActions'
import {cardName as decisionCardName} from 'containers/screenings/DecisionFormContainer'
import {resetFieldValues as resetWorkerSafetyFormValues} from 'actions/workerSafetyFormActions'
import {cardName as workerSafetyCardName} from 'containers/screenings/WorkerSafetyFormContainer'
import {resetFieldValues as resetCrossReportFormValues} from 'actions/crossReportFormActions'
import {cardName as crossReportsCardName} from 'containers/screenings/CrossReportFormContainer'

export function* clearCardEdits({payload: {card}}) {
  const screening = yield select(getScreeningSelector)
  const actions = {
    [allegationsCardName]: resetAllegations,
    [crossReportsCardName]: resetCrossReportFormValues,
    [decisionCardName]: resetScreeningDecisionFormValues,
    [incidentInformationCardName]: resetIncidentInformationValues,
    [narrativeCardName]: resetNarrativeFormValues,
    [screeningInformationCardName]: resetScreeningInformationValues,
    [workerSafetyCardName]: resetWorkerSafetyFormValues,
  }
  yield put(actions[card](screening.toJS()))
}
export function* clearCardEditsSaga() {
  yield takeEvery(CLEAR_CARD_EDITS, clearCardEdits)
}
