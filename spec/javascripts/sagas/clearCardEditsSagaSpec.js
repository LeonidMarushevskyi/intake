import 'babel-polyfill'
import {takeEvery, put, select} from 'redux-saga/effects'
import {fromJS} from 'immutable'
import {clearCardEditsSaga, clearCardEdits} from 'sagas/clearCardEditsSaga'
import {clearCardEdits as clearEdits, CLEAR_CARD_EDITS} from 'actions/screeningActions'
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

describe('clearCardEditsSaga', () => {
  it('clears card edits on CLEAR_CARD_EDITS', () => {
    const gen = clearCardEditsSaga()
    expect(gen.next().value).toEqual(takeEvery(CLEAR_CARD_EDITS, clearCardEdits))
  })
})

describe('clearCardEdits', () => {
  it('resets allegations form values', () => {
    const action = clearEdits(allegationsCardName)
    const screening = fromJS({id: 123, allegations: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetAllegations(screening.toJS()))
    )
  })

  it('resets screening information form values', () => {
    const action = clearEdits(screeningInformationCardName)
    const screening = fromJS({id: 123, name: 'My Screening'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetScreeningInformationValues(screening.toJS()))
    )
  })

  it('resets narrative form values', () => {
    const action = clearEdits(narrativeCardName)
    const screening = fromJS({id: 123, narrative: 'My Narrative'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetNarrativeFormValues(screening.toJS()))
    )
  })

  it('resets incident information form values', () => {
    const action = clearEdits(incidentInformationCardName)
    const screening = fromJS({id: 123, incident_date: '01/01/1990'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetIncidentInformationValues(screening.toJS()))
    )
  })

  it('resets worker safety form values', () => {
    const action = clearEdits(workerSafetyCardName)
    const screening = fromJS({id: 123, safety_alerts: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetWorkerSafetyFormValues(screening.toJS()))
    )
  })

  it('resets cross report form values', () => {
    const action = clearEdits(crossReportsCardName)
    const screening = fromJS({id: 123, cross_reports: []})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetCrossReportFormValues(screening.toJS()))
    )
  })

  it('resets decision form values', () => {
    const action = clearEdits(decisionCardName)
    const screening = fromJS({id: 123, decision: 'screen_out'})

    const gen = clearCardEdits(action)
    expect(gen.next().value).toEqual(
      select(getScreeningSelector)
    )
    expect(gen.next(screening).value).toEqual(
      put(resetScreeningDecisionFormValues(screening.toJS()))
    )
  })
})
